import type { SplitMode } from '../types';

export interface SplitInput {
  totalAmount: number;
  participants: string[]; // party_member_id array
  splitMode: SplitMode;
  /**
   * Mode'a göre özel değerler:
   * - percentage: { "id1": 40, "id2": 60 } (Yüzde dilimleri)
   * - exact: { "id1": 150, "id2": 50 } (Tam tutarlar)
   * - shares: { "id1": 2, "id2": 1 } (Pay adedi, örn: Biri 2 porsiyon yedi)
   */
  customValues?: Record<string, number>;
}

/**
 * Denkleş "Bölüşüm Motoru" - Saf fonksiyon.
 * Asla küsurat (penny) hatası yapmaz. (Örn: 100 TL / 3 Kişi = 33.34, 33.33, 33.33)
 */
export const calculateOwedAmounts = (input: SplitInput): Record<string, number> => {
  const { totalAmount, participants, splitMode, customValues } = input;
  const owed: Record<string, number> = {};

  if (participants.length === 0) return owed;

  // JavaScript'te float sorunlarını (0.1 + 0.2 = 0.300000004) önlemek için her şeyi kuruşa (cents) çeviriyoruz.
  const toCents = (amount: number) => Math.round(amount * 100);
  const toDollars = (cents: number) => cents / 100;
  const totalCents = toCents(totalAmount);

  if (splitMode === 'equal') {
    const baseShareCents = Math.floor(totalCents / participants.length);
    let remainderCents = totalCents % participants.length;

    participants.forEach(p => {
      let share = baseShareCents;
      if (remainderCents > 0) {
        share += 1;
        remainderCents -= 1;
      }
      owed[p] = toDollars(share);
    });
    return owed;
  }

  if (splitMode === 'exact') {
    if (!customValues) throw new Error("Exact (Tam Tutar) modu için özel değerler girilmelidir.");
    let sumCents = 0;
    participants.forEach(p => {
      const valCents = toCents(customValues[p] || 0);
      owed[p] = toDollars(valCents);
      sumCents += valCents;
    });
    if (sumCents !== totalCents) {
      throw new Error(`Kuruş hatası: Toplam girilen tutar ${toDollars(sumCents)} ₺, ancak asıl hesap ${totalAmount} ₺.`);
    }
    return owed;
  }

  if (splitMode === 'percentage') {
    if (!customValues) throw new Error("Yüzde modu için yüzdelikler belirtilmelidir.");
    let percentSum = 0;
    participants.forEach(p => percentSum += (customValues[p] || 0));

    // Küçük float hassasiyeti için epsilon kontrolü (99.999 ile 100.001 arası kabul edilebilir)
    if (Math.abs(percentSum - 100) > 0.01) {
      throw new Error("Yüzdeler toplamı tam olarak 100 olmalıdır.");
    }

    let allocatedCents = 0;
    const sharesCents = participants.map(p => {
      const pct = customValues[p] || 0;
      const shareCents = Math.floor((totalCents * pct) / 100);
      allocatedCents += shareCents;
      return { p, shareCents };
    });

    let remainder = totalCents - allocatedCents;
    sharesCents.forEach(item => {
      if (remainder > 0) {
        item.shareCents += 1;
        remainder -= 1;
      }
      owed[item.p] = toDollars(item.shareCents);
    });
    return owed;
  }

  if (splitMode === 'shares') {
    if (!customValues) throw new Error("Pay modu için pay (share) adetleri belirtilmelidir.");
    let totalShares = 0;
    participants.forEach(p => totalShares += (customValues[p] || 0));
    if (totalShares === 0) throw new Error("Toplam pay 0 olamaz.");

    let allocatedCents = 0;
    const sharesCents = participants.map(p => {
      const shares = customValues[p] || 0;
      const shareCents = Math.floor((totalCents * shares) / totalShares);
      allocatedCents += shareCents;
      return { p, shareCents };
    });

    let remainder = totalCents - allocatedCents;
    sharesCents.forEach(item => {
      if (remainder > 0) {
        item.shareCents += 1;
        remainder -= 1;
      }
      owed[item.p] = toDollars(item.shareCents);
    });
    return owed;
  }

  return owed;
};
