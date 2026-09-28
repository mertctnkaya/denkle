export interface RawDebt {
  payer: string; // Parayı kasadan çıkartan kişi
  payee: string; // Başkası adına ödeme yapıldığı için borçlanan kişi
  amount: number;
}

export interface SimplifiedDebt {
  from: string; // Parayı ödemesi gereken kişi (Borçlu)
  to: string; // Parayı alması gereken kişi (Alacaklı)
  amount: number;
}

export interface SimplificationOptions {
  /**
   * "Boşver Modu" (Tolerance)
   * Eğer iki kişi arasındaki nihai borç belirlediğimiz eşiğin (örneğin 1 TL) altındaysa
   * bunu tahsil edilmeyecek kadar küçük sayıp "Boşver" listesine alabiliriz.
   * Şimdilik varsayılan 0 (Kuruşu kuruşuna tahsilat).
   */
  forgiveThresholdAmount?: number;
}

/**
 * Denkleş "Borç Sadeleştirme Motoru"
 * A -> B'ye 50 öder, B -> C'ye 50 öderse => Sadece A -> C'ye 50 öder şeklinde grafiği optimize eder.
 */
export const simplifyDebts = (
  rawDebts: RawDebt[],
  options: SimplificationOptions = { forgiveThresholdAmount: 0 }
): SimplifiedDebt[] => {
  // 1. Herkesin net bakiyesini (balance) hesapla
  const balances: Record<string, number> = {};

  const toCents = (a: number) => Math.round(a * 100);
  const toDollars = (c: number) => c / 100;

  rawDebts.forEach(({ payer, payee, amount }) => {
    if (!balances[payer]) balances[payer] = 0;
    if (!balances[payee]) balances[payee] = 0;

    const cents = toCents(amount);
    // Payer parayı kendi cebinden verdi, bu yüzden alacaklı duruma geçer (+)
    balances[payer] += cents;
    // Payee adına ödeme yapıldı, bu yüzden borçlu duruma geçer (-)
    balances[payee] -= cents;
  });

  // 2. Borçluları ve Alacaklıları iki ayrı listeye ayır
  // Bakiyesi negatif olanlar borçludur (Para vermeleri lazım)
  const debtors = Object.keys(balances)
    .map(id => ({ id, balance: balances[id] }))
    .filter(x => x.balance < 0)
    .sort((a, b) => a.balance - b.balance); // En çok borcu olan en başta (-1000, -500...)

  // Bakiyesi pozitif olanlar alacaklıdır (Para almaları lazım)
  const creditors = Object.keys(balances)
    .map(id => ({ id, balance: balances[id] }))
    .filter(x => x.balance > 0)
    .sort((a, b) => b.balance - a.balance); // En çok alacağı olan en başta (+1000, +500...)

  const simplified: SimplifiedDebt[] = [];
  const forgiveThresholdCents = toCents(options.forgiveThresholdAmount || 0);

  let d = 0;
  let c = 0;

  // 3. En büyük borçlu ile en büyük alacaklıyı eşleştirerek bakiyeleri erit
  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];

    // Ödenecek tutar, borçlunun borcu ile alacaklının alacağından hangisi küçükse odur
    const amountCents = Math.min(-debtor.balance, creditor.balance);

    if (amountCents > forgiveThresholdCents) {
      simplified.push({
        from: debtor.id,
        to: creditor.id,
        amount: toDollars(amountCents)
      });
    }

    // Bakiyeleri güncelle
    debtor.balance += amountCents;
    creditor.balance -= amountCents;

    // Kimin bakiyesi sıfırlandıysa (denkleştiyse) sıradakine geç
    if (Math.abs(debtor.balance) < 1) d++;
    if (Math.abs(creditor.balance) < 1) c++;
  }

  return simplified;
};
