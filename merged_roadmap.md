# 🗺️ Denkleş — BİRLEŞTİRİLMİŞ YOL HARİTASI (Roadmap + UX Kararları)

> **Durum:** ONAY BEKLİYOR — Kullanıcı onay verene kadar hiçbir kod yazılmayacak.
> Yeni eklenen maddeler ✨ **NEW** ile işaretlenmiştir.

---

## Mevcut Roadmap ile UX Plan Karşılaştırması

Mevcut roadmap'te eksik olan veya yetersiz kalan 5 kritik alan tespit edildi:

| Konu | Mevcut Roadmap'te | Durumu |
|------|-------------------|--------|
| Üye çıkarılınca harcama recalc | ❌ Hiç yok | v0.1'e eklenmeli |
| Bakiye dökümü (breakdown) | ❌ Hiç yok | v0.1'e eklenmeli |
| Audit/Event log | ✅ Bahsedilmiş (Bölüm 8) | Detaylandırılıp v0.1'e taşınmalı |
| Yönetim modeli (demokrasi) | ⚠️ Kısmen var (roller) | Detaylandırılıp v0.1 + v0.4'e bölünmeli |
| Harcama düzenleme | ❌ Hiç yok | v0.1'e eklenmeli |

---

## 16. KESİN FAZLANDIRMA VE GELİŞTİRME YOL HARİTASI (GÜNCELLENMİŞ)

> _MVP'de ASLA Olmayacaklar: Navigasyon, canlı konum, OCR, AI, banka entegrasyonu, arkadaş listesi, halka açık partiler._

---

### ✅ Aşama 0 — Kurulum (TAMAMLANDI)
- [x] Vite + React + Tailwind + Capacitor kurulumu
- [x] `src/core/` altında TypeScript ile bölüşüm algoritmaları (splitEqually, splitByPercentage, splitByExact, splitByShares)
- [x] Borç Sadeleştirme (Debt Simplification) motoru (`debtSimplificationEngine.ts`)
- [x] Supabase RLS tabloları (`profiles`, `parties`, `party_members`, `shares`, `share_participants`, `settlements`)
- [x] Shared Components (`Button`, `Modal`, `Toast`, `Icon`, `EmptyState`)
- [x] Auth (E-posta + Google OAuth) ve profil yönetimi
- [x] Tema sistemi (Light/Dark)
- [x] Responsive layout (TopNav desktop / BottomNav mobile)

---

### 🔴 v0.1 — MVP / Temel Bölüşüm (AKTİF GELİŞTİRME)

**Temel Özellikler (Mevcut):**
- [x] Parti kur, Kod ile katıl
- [x] Hayalet (Shadow) profil oluşturma
- [x] "Ben Ödedim" harcama oluşturma (Eşit / Yüzde / Sabit / Pay bölüşüm)
- [x] Ödedim / Tahsil Ettim durumu
- [x] Harcama silme (rol bazlı yetki)
- [x] Harcama detay modalı (read-only)
- [x] Üye listesi ve rol yönetimi (Owner/Admin/Member)
- [x] Üye çıkarma modalı (confirm yerine modal)

**✨ NEW — Üye Çıkarma & Harcama Recalculation:**
- [ ] Üye çıkarılınca o kişinin dahil olduğu **eşit bölüşüm** harcamaları kalan kişilere otomatik yeniden dağıtılır
  - Örnek: 3462 / 4 kişi → 1 kişi çıkar → 3462 / 3 kişi = 1154 TL
  - `share_participants` tablosundaki `owed_amount` değerleri güncellenir
  - `paid_amount` değişmez (kasadan parayı çıkaran kişi aynı kalır)
- [ ] Yüzde/sabit/pay bölüşümlerde üye çıkarılamaz → "Önce harcamayı düzenleyin veya silin" uyarısı
- [ ] Çıkarma onay modalında etkilenen harcama sayısı gösterilir

**✨ NEW — Bakiye Dökümü (Balance Breakdown):**
- [ ] Özet kartındaki ("+₺1731") rakama tıklanınca **Bakiye Detay Modalı** açılır
- [ ] Her harcama satır satır listelenir:
  - Harcama adı | Senin rolün ("Sen ödedin" / "Dahilsin") | Net etki (+₺2596.50 / -₺150.00)
- [ ] Alt satırda **NET TOPLAM** gösterilir
- [ ] Her satır tıklanabilir → harcama detay modalına yönlendirir

**✨ NEW — Harcama Düzenleme (Share Edit):**
- [ ] Harcama detay modalında **"Düzenle"** butonu (sadece oluşturan + owner/admin)
- [ ] Düzenlenebilir alanlar: Tutar, katılımcılar, bölüşüm modu, kim ödedi
- [ ] Düzenleme yapıldığında `share_participants` yeniden hesaplanır
- [ ] Düzenleme event olarak loglanır (audit trail)

**✨ NEW — Event Log (Audit Trail) — Temel Altyapı:**
- [ ] `party_events` tablosu oluşturulur (Supabase)
  ```
  id, party_id, actor_id, event_type, description, metadata, created_at
  ```
- [ ] Event tipleri: `member_joined`, `member_removed`, `share_created`, `share_deleted`, `share_edited`, `share_recalculated`, `settlement_completed`, `role_changed`
- [ ] Her kritik işlemde otomatik event kaydı düşer (store fonksiyonlarına entegre)
- [ ] UI'da henüz gösterilmez, sadece veri tabanında birikir (v0.2'de UI gelecek)

**✨ NEW — Kuruculuk Devri:**
- [ ] Grup ayarlarında (⚙️) **"Kuruculuğu Devret"** butonu (sadece owner görür)
- [ ] Tıklanınca üye listesi açılır, seçilen kişi yeni owner olur
- [ ] Eski owner otomatik admin'e düşer
- [ ] Kurucu kendini gruptan çıkaramaz (önce devretmeli)

**✨ NEW — Harcama Detay Modalı Düzeltmeleri:**
- [ ] Ortaklar bölümündeki yüzde hesabı doğru gösterilir (%25 değil, kalan kişiye göre dinamik %33.33 vb.)
- [ ] Toplam kontrol: Ortakların paylarının toplamı = Harcama tutarı olmalı, tutmuyorsa uyarı gösterilir

**Yönetim Modeli (v0.1 Kuralları):**
- Owner: Her şeyi yapabilir (üye ekle/çıkar, rol değiştir, harcama sil/düzenle, kuruculuğu devret)
- Admin: Hayalet üye ekle, harcama ekle/sil/düzenle
- Member: Harcama ekle, kendi harcamasını sil, Ödedim/Tahsil Ettim
- Hayalet: Hiçbir yetki yok — sadece "Davet Et" placeholder butonu
- Kurucu kendini çıkaramaz, önce kuruculuğu devretmeli

---

### 🟡 v0.2 — FuelSplit DNA / Yolculuk

**Mevcut:**
- [ ] Google Maps Autocomplete (Session Token ile)
- [ ] Araç Profilleri (vehicles tablosu)
- [ ] Km hesabı, tahmini yakıt tüketimi
- [ ] Otoyol ücreti (manuel giriş)
- [ ] Tahmini vs Gerçekleşen yakıt farkı

**✨ NEW — Event Log UI:**
- [ ] Harcamalar feed'ine event kartları karıştırılır (tarih sırasına göre)
  - `🔔 Mert, "test3" adlı hayalet üyeyi gruptan çıkardı — 2 dk önce`
  - `📋 "dizel" harcaması 3 kişiye yeniden bölüştürüldü`
- [ ] Event kartları küçük, gri ve ayırt edilebilir (harcama kartlarından farklı)

**✨ NEW — Grup Ayarları Sayfası:**
- [ ] ⚙️ butonuna basılınca açılan tam sayfa
- [ ] Grup adını düzenle
- [ ] Davet kodunu yenile
- [ ] Grubu arşivle
- [ ] Kuruculuğu devret
- [ ] (v0.4'te: Demokratik mod toggle)

---

### 🟢 v0.3 — Market ve Zengin İçerik

**Mevcut:**
- [ ] Fotoğraf limiti (3 adet, Storage)
- [ ] Paylaşım içi yorum/chatleşme (Thread)
- [ ] Ürün bazlı kalem kalem ayırma (Itemized split)

---

### 🔵 v0.4 — Otomasyon & Analitik

**Mevcut:**
- [ ] Tekrarlayan abonelikler (aylık kira/Netflix)
- [ ] Karma/Güven Puanı
- [ ] Grafiksel istatistikler
- [ ] Push Bildirimleri

**✨ NEW — Demokratik Mod (Opsiyonel):**
- [ ] Grup ayarlarından "Demokratik Mod" açılabilir (varsayılan: kapalı)
- [ ] Açıkken hassas işlemler (üye çıkarma, harcama silme) oylama gerektirir
- [ ] Grubun çoğunluğu onaylarsa işlem gerçekleşir
- [ ] Hayalet üyeler oy kullanamaz
- [ ] 24 saat içinde yeterli oy gelmezse işlem iptal olur

**✨ NEW — Gelişmiş Bakiye Analitiği:**
- [ ] "Bu Ay" / "Tüm Zamanlar" filtreleme
- [ ] Kategori bazlı harcama dağılımı (pasta grafik)
- [ ] "En çok kime borçlandın" / "En çok kimden alacağın var" sıralaması

---

### 🟣 v0.5 — Sosyal & Premium

**Mevcut:**
- [ ] Instagram Story paylaşım kartları
- [ ] QR Şablonları (Buzdolabı Modu)
- [ ] OCR Fiş okuma (Premium)
- [ ] RevenueCat entegrasyonu

---

### ⚪ v1.0 — Gerçek Ürün

- [ ] Capacitor Android paketi
- [ ] Play Store yayın
- [ ] Premium katman (RevenueCat)
- [ ] Claim Profile (Hayalet → Gerçek hesap merge)

---

## GEMINI.md'ye Eklenmesi Gereken Değişiklikler

### Veritabanı Şemasına Yeni Tablo:

```
### 8. `party_events` (Olay Geçmişi / Audit Log)

- `id` (uuid, PK)
- `party_id` (uuid, references parties ON DELETE CASCADE, not null)
- `actor_id` (uuid, references party_members ON DELETE SET NULL, nullable)
- `event_type` (text, not null)
  -- 'member_joined', 'member_removed', 'member_role_changed',
  -- 'share_created', 'share_deleted', 'share_edited', 'share_recalculated',
  -- 'settlement_completed', 'party_settings_changed', 'ownership_transferred'
- `description` (text, not null)
- `metadata` (jsonb, nullable)
- `created_at` (timestamptz, default now())
```

### Mevcut Tabloların Güncellenmesi:

`shares` tablosuna eklenmeli:
- `updated_at` (timestamptz, nullable — düzenleme tarihi)

---

## Uygulama Öncelik Sırası (v0.1 İçi)

Bu sırayla kodlanacak:

| # | İş Paketi | Dosyalar |
|---|-----------|----------|
| 1 | Harcama detay modalı yüzde düzeltmesi | `ViewShareModal.tsx` |
| 2 | Üye çıkarma + eşit harcama recalculation | `partyStore.ts`, `shareStore.ts`, `splittingEngine.ts` |
| 3 | Bakiye dökümü modalı | Yeni: `BalanceBreakdownModal.tsx`, `PartyDetail.tsx` |
| 4 | `party_events` tablosu + store entegrasyonu | SQL, `partyStore.ts`, `shareStore.ts` |
| 5 | Kuruculuk devri | `partyStore.ts`, `PartyMembersTab.tsx` |
| 6 | Harcama düzenleme | `AddShareModal.tsx` → `ShareFormModal.tsx` (reuse) |

> [!IMPORTANT]
> Bu plan onaylanmadan hiçbir satır kod yazılmayacak.
