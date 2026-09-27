# FAIRLY SHARE - MASTER ENTERPRISE SAAS ARCHITECTURE & AI AGENT MANIFESTO

> **HEDEF ORTAM:** VS Code (Antigravity) & Her Türlü LLM Tabanlı AI Asistanı.
> **DURUM:** KESİN (STRICT). Bu dosyadaki kurallar esnetilemez, tartışılamaz ve bypass edilemez.

Bu doküman, "Fairly Share" projesinin mükemmeliyetçi mühendislik prensiplerinden, tasarım disiplininden ve yapay zeka (AI) kurallarından süzülerek oluşturulmuş **evrensel başucu rehberidir**. AI asistanı (Agent), bu projedeki her satır kodu yazarken bu dokümandaki kurallara göre hareket edecektir.

---

## BÖLÜM 1: AI (YAPAY ZEKA) KİMLİĞİ VE ÇALIŞMA MANİFESTOSU

Yeni projede AI, sıradan bir kod asistanı değil, projenin **"Principal Full-Stack Engineer & Systems Architect"i** olarak hareket eder.

1. **"Çalışsın Yeter" Yasaktır (No Vibe-Coding):** Asla "mock", "placeholder" (yer tutucu) veya uydurma veri içeren kod yazılmaz. Yazılan her satır kod prodüksiyona (canlı ortama) çıkmaya hazır, güvenli ve performanslı olmalıdır.
2. **Araç Kullanım Disiplini:** AI, dosya okuma ve yazma işlemleri için terminal scriptlerini KESİNLİKLE KULLANMAZ. Kendi yerleşik araçlarını (`view_file`, `replace_file_content`, `write_to_file`) kullanır.
3. **Önce Düşün, Sonra Yaz:** Yeni bir modül yazılmadan önce `GEMINI.md` dosyasındaki ilgili faz (v0.1, v0.2) ve veritabanı şeması kontrol edilir.

---

## BÖLÜM 2: "5S" CLEAN CODE & DOSYA MİMARİSİ (VARDİYO MİRASI)

1. **Seiri (Ayıkla):** Kullanılmayan kütüphaneler, ölü importlar, `console.log` satırları ve `any` tipleri kodda barınamaz.
2. **Seiton (Düzenle - Single Responsibility):**
   - Görsel Sayfalar: `src/pages/`
   - UI Parçaları: `src/components/<domain>/`
   - Ortak Bileşenler: `src/components/shared/` (Buton, Modal, Alert)
   - Matematik ve Bölüşüm Motoru: `src/core/`
   - API ve Servisler: `src/services/`
   - Zustand State: `src/store/`
3. **Seiso (Temizle):** Tutarlı indentasyon, katı ESLint.
4. **Seiketsu (Standartlaştır - DUMB COMPONENT KURALI):** UI bileşenleri (`src/components/`) sadece veri (prop) alır ve HTML çizer. Supabase sorguları veya karmaşık hesaplamalar React bileşeni içinde DEĞİLDİR. Hook'lara veya Store'a devredilir.
5. **Dosya Sınırı:** Bir dosya 200 satırı aşıyorsa, parçalara bölünür.

---

## BÖLÜM 3: "ENGINE ROOM" (SAF HESAPLAMA MOTORLARI)

Uygulamanın en hayati parçası bölüşüm mantığıdır. Bu yükler **ASLA** UI dosyalarında veya Zustand store içinde hesaplanmaz.

- `src/core/splittingEngine.ts` ve `src/core/debtSimplificationEngine.ts` gibi dosyalar React'ten ve dış kütüphanelerden tamamen bağımsız, saf (pure) TypeScript fonksiyonları olarak yazılır.
- **Kuruş Hassasiyeti:** Eşit bölüşümdeki 33.33, 33.33, 33.34 mantığı gibi küsuratlar `core/` içinde kesinlikle yönetilir.

---

## BÖLÜM 4: OFFLINE-FIRST (ÇEVRİMDIŞI) SENKRONİZASYON MOTORU

İnternet kesildiğinde veya dağlık bir yolda gezi yaparken uygulama çökmez.

1. İşlemler lokal FIFO kuyruğuna yazılır (`src/services/offlineStorage.ts`).
2. Kullanıcı UI'da işlemin anında gerçekleştiğini görür (Optimistic UI).
3. İnternet bağlandığında `syncService.ts` devreye girip Supabase'e arka planda basar.
4. UI'da "Offline" veya "Senkronize Ediliyor" rozeti bulunur.

---

## BÖLÜM 5: GÜVENLİK (ZERO-TRUST & SUPABASE RLS)

Sistemin arkaplanı askeri düzeyde katı olmalıdır:

1. **RLS (Row Level Security):** Bir kullanıcı `party_members` tablosunda o grubun üyesi değilse, gruptaki hiçbir paylaşıma, fotoğrafa veya mesaja erişemez. Client taraflı `if(isMember)` kontrolü geçersizdir, koruma API'de olmalıdır.
2. **Hayalet Kullanıcılar (Shadow Profiles):** Parti sahibinin oluşturduğu indirmesiz kullanıcıların güvenlik bağlamı, partiyi kuran kişiye bağlıdır.
3. **Edge Functions:** Google Maps gibi API key gerektiren maliyetli çağrılar frontend'den değil, Supabase Edge Function üzerinden tetiklenir (Gizlilik ve Maliyet kontrolü).

---

## BÖLÜM 6: TASARIM SİSTEMİ (LIGHT & DARK DUAL THEME)

Fairly Share; profesyonel, modern, minimal ve hem Açık (Light) hem Koyu (Dark) mod destekleyen bir yapıdadır.
Tasarım felsefesi "Temiz Sosyal Finans" üzerine kuruludur.

**Semantik Renk Disiplini (İki Modda da Geçerli Algı):**

- **Emerald (Yeşil):** Ödendi (Settled), Alacaklı, Net Pozitif, Başarılı.
- **Red/Rose (Kırmızı):** Borç, Ödenmemiş, Hata, Silme.
- **Indigo/Blue (Mavi):** Marka Rengi, Ana Navigasyon, Odak, "Ben Ödedim" butonu.
- **Amber (Turuncu):** Bekleyen Ödeme, Hesaplama, Sistem Uyarıları.

**Shared Component Zorunluluğu:**

- Hiçbir dosyada rastgele `<svg>` çizilmez, `src/components/shared/Icon.tsx` kullanılır.
- Modal'lar, Buton'lar, Boş Ekranlar (Empty State) ve Alert'ler `shared/` klasöründen çağrılır.

---

## BÖLÜM 7: FAIRLY SHARE ÜRÜN & MİMARİ KARARLARI

1. **2 Saniyede Paylaş:** Ekranda kocaman bir "Hızlı Paylaş" butonu. UI yeni kullanıcıyı korkutmamalıdır. Miktar, Kategori, Kişiler seçilir ve biter.
2. **Kategori Değil, 'Paylaşım' Odaklı:** Veritabanında yakıt, yemek, kira diye tablolar yoktur. Hepsi polymorphic bir `SHARES` (Paylaşımlar) tablosudur. UI'da araçları farklıdır.
3. **Banka Yok, IBAN Var:** Para uygulama içinden çekilmez/aktarılmaz. Uygulama bir mutabakat/hakem sistemidir. IBAN ve Ad-Soyad kopyalama butonlarıyla işlem bankada yapılır, uygulamada "Ödedim" denir.

### 🤖 [AI FİKRİ (BENİM FİKRİM) - ÜRÜNE EKLENTİLER]

Yapay Zeka (Agent) olarak uygulamaya dahil ettiğim orijinal fikirler:

- **💡 AI Fikri 1: Karma (Güven) Puanı:** Bireylerin borç ödeme hızına göre hesaplanan eğlenceli bir puan. "Mert borçlarını ortalama 2 günde kapatır (%95 Güvenilir)". Bu, arkadaş gruplarında ödemeyi unutanlara tatlı bir baskı unsuru olur.
- **💡 AI Fikri 2: Hızlı Şablon QR Kodları:** Ev arkadaşları için "Buzdolabı Modu". Uygulama içi bir "Ev Grubu QR Kodu" çıkar. Bu kod çıktı alınıp buzdolabına asılır. Birisi marketten gelince kamerayla okutur ve uygulama saniyesinde "Ev Market Şablonunu" (%33 x 3 eşit) açar, sadece tutarı girmek kalır.
- **💡 AI Fikri 3: Ödeme Sataşması (Nudge/Dürt):** Sürekli bildirim atmak yerine, ödemesini geciktiren kişiye eğlenceli "Dürtme" butonları. (Örn: Titreşim gönder, Ekrana komik bir gif çıkar).

---

## BÖLÜM 8: FAZLANDIRILMIŞ YOL HARİTASI (STRICT RELEASE PLAN)

Mimarinin çöplüğe dönmemesi için her faz bitmeden diğerine GEÇİLMEZ.

- **Aşama 1 (Kurulum ve Core Engine):** Vite + React + Tailwind + Capacitor kurulumu. `src/core/` altında TypeScript ile bölüşüm algoritmalarının ve borç sadeleştirme (Debt Simplification) motorunun saf (UI'sız) kodlanması. Supabase RLS tablolarının (`profiles`, `parties`, `party_members`, `shares`, `share_participants`) kurulması.
- **v0.1 - "MVP / Temel Bölüşüm":** Auth, Parti kur, Kod ile katıl. Hayalet/Temsili profil (Shadow Profile) oluşturma. "Ben Ödedim" butonu (Eşit/Yüzde/Sabit bölüşümler). Ödedim/Ödemedim durumu. Bireysel log.
- **v0.2 - "FuelSplit DNA / Yolculuk":** Google Maps Autocomplete (Session Token ile), Araç Profilleri, Km hesabı. (Toll/Otoyol manuel). Tahmini ve Gerçekleşen yakıt farkı.
- **v0.3 - "Market ve Zengin İçerik":** 3 Adet fotoğraf limiti (Storage), Paylaşım içi yorum/chatleşme. Ürün bazlı kalem kalem ayırma (Itemized).
- **v0.4 - "Otomasyon & Analitik":** Tekrarlayan abonelikler (Aydan aya kira/Netflix), Karma/Güven Puanı (AI Fikri), Grafiksel istatistikler. Push Bildirimler.
- **v0.5 - "Sosyal & Premium":** Instagram Story paylaşım kartları, QR Şablonları (AI Fikri), OCR Fiş okuma (Premium), RevenueCat.

---

**BU DOSYA, ÜRETİLECEK YENİ FAIRLY SHARE PROJESİNİN ANA ANAYASASIDIR. YAPAY ZEKA (AI), BU DOSYADAKİ MİMARİ, TASARIM VE KOD DİSİPLİNİNE SONUNA KADAR SADIK KALARAK KOD ÜRETMELİDİR.**
