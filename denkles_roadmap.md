# 🗺️ Denkleş - MASTER ÜRÜN VİZYONU VE YOL HARİTASI

> Bu doküman, uygulamanın tüm fikirlerini, 70 maddelik orijinal vizyonunu, UI taslaklarını ve mimari kararlarını eksiksiz barındıran YAŞAYAN BİR ÜRÜN PLANIDIR. Hiçbir detay kırpılmadan buraya işlenmiştir.

---

## 1. UYGULAMANIN TEK CÜMLELİK AMACI

**"Birlikte yapılan masrafları böl, paylaş ve kapanana kadar takip et."**
Sadece yakıt, sadece yemek veya sadece arkadaş borcu değil. Sipariş, market, yolculuk, kira, tatil, bilet, taksi, hediye, ev masrafı, "ben aldım sonra ödersiniz", hatta "Ali'nin kamerasını ödünç aldım" gibi şeylerin hepsi aynı sistemin farklı dallarıdır.

---

## 2. KATEGORİ DEĞİL, "MOTOR" MİMARİSİ

Veritabanında market, yolculuk, akşam yemeği diye ayrı tablolar YOKTUR. Hepsi **PAYLAŞIM (SHARE)** nesnesidir.

- **Ortak Veriler:** Başlık, kategori, oluşturan, toplam tutar, tarih, katılımcılar, bölüşüm yöntemi, ödeyen, paylar, durum, yorumlar.
- **Kategoriye Özel Veriler (Metadata):** Her kategori için özel UI araçları tasarlanır ancak veritabanına JSONB olarak veya ilişkisel tablolarla esnek yazılır (Bkz. Bölüm 12 - Genişletilmiş Kategoriler).

---

## 3. ANA EKRAN TASARIMI VE UI VİZYONU

İlk açılış çok basit ve net olmalıdır:

```text
                    Merhaba Mert

             Bu ay paylaşımlar
         ┌──────────────────────┐
         │  Ödeyeceğin          │
         │  ₺1.240              │
         └──────────────────────┘
         ┌──────────────────────┐
         │  Alacağın            │
         │  ₺680                │
         └──────────────────────┘

         [ + Yeni Paylaşım ] (⚡ Ben Ödedim / Hızlı Paylaş)

    Aktif Paylaşımlar
    🚗 Dikili Yolculuğu       ₺3.420
    🛒 Ev Alışverişi             ₺337
    🍕 Akşam Yemeği              ₺780

    Partilerim
    🏠 Ev
    👥 Çocukluk Arkadaşları
    🚗 İzmir Gezisi
```

---

## 4. PARTİ (GRUP) VE KATILIM SİSTEMİ

Uygulama iki kullanım biçimine dayanır:

1.  **Geçici Paylaşım:** 4 arkadaş İzmir'e gider. "İzmir 2026" partisi açılır, X7K4P9 koduyla girilir, gezi bitince arşivlenir.
2.  **Kalıcı Grup:** Ev arkadaşları (Kira, fatura, market her ay döner).

### Hiyerarşi ve Katılım

- **Roller:** Sahip (Grubu siler, atar), Yönetici (Paylaşım oluşturur), Üye (Katılır, öder). Kategori bazlı yetki verilebilir (Market'i sadece ev sahibi açsın).
- **Güvenli Katılım:** Kod girilir, Nick seçilir, Parti sahibine "Ahmet katılmak istiyor" onayı gider. Herkes kafasına göre giremez.

### Temsili (Hayalet) Kullanıcı & Devretme (Claim Profile) Sistemi

- Arkadaş uygulamayı indirmemiştir. Parti sahibi sadece "Ahmet" adında geçici bir misafir (hayalet) ekler.
- **Profili Devretme:** İleride Ahmet uygulamayı indirdiğinde sistem onu isimden otomatik tanıyamaz. Parti sahibi, kendi ekranındaki hayalet profile tıklayıp "Profili Devret" der. Sistem tek kullanımlık, şifreli bir davet linki üretir (`Denkleş.app/claim/xyz123`).
- Gerçek Ahmet bu linke tıklayıp kayıt olduğunda, veritabanı arka planda hayalet ID'sini, Ahmet'in yeni gerçek `auth.uid()`'si ile birleştirir (Merge). Ahmet uygulamaya girdiği saniye, geçmiş tüm borç ve ödemelerini kendi hesabında hazır görür.

---

## 5. BÖLÜŞÜM MOTORU (CORE ENGINE)

Uygulamanın kalbi. Şu modlar kesinlikle olmalıdır:

- **Eşit Bölüşüm:** 337 TL / 3 Kişi = 112.33, 112.33, 112.34 (Kuruşlar otomatik dağıtılır).
- **Yüzde:** Mert %50, Ali %30, Mehmet %20.
- **Sabit Tutar:** Mert 150, Ali 100, Mehmet 87.
- **Pay/Ağırlık:** Mert 2 pay, Ali 1 pay, Mehmet 1 pay.
- **Kişi Bazlı Dahil/Hariç:** 4 kişilik grupta yemeği 3 kişi yedi, birinin tiki kaldırılır otomatik 3'e bölünür.
- **Rastgele (Şanslı Bölüşüm):** 337₺ kahve hesabı sisteme atılır, sistem rastgele (97, 124, 116) dağıtır. Eğlence modudur.
- **Ürün Bazlı (İleri Aşama):** Mert Pizza (300) + Kola (80), Ali Burger (250). Ortak Patates (90). Sistem otomatik çözer.

---

## 6. ASIL BOMBA: BORÇ SADELEŞTİRME & HESAP DENKLEŞTİRME

Mert Ali'ye 200₺, Ali Mehmet'e 150₺, Mehmet Mert'e 50₺ borçludur.
Uygulama "Borçları sadeleştir" dediğinde matematiksel olarak netleştirip en az transferle (Mert -> Mehmet vb.) hesabı kapatır.

---

## 7. ÖDEME YÖNETİMİ VE "BEN ÖDEDİM" KONSEPTİ

- Para uygulama içinden **GEÇMEZ**. Banka sistemi yoktur. Uygulama bir hakemdir.
- **Ben Ödedim Hızlı Modu:** Mert markete gider, 337₺ öder. Ana ekranda "Ev Alışverişi -> 337₺ -> Ödeyen: Mert -> Paylaştır: Herkes". Bitti.
- **Kişisel Ekran:** Ahmet'in ekranında "Ev Alışverişi - Senin Payın: 112,33₺" yazar. Altında `[ ÖDEDİM ]` ve `[ DAHA SONRA ÖDEYECEĞİM ]` butonları vardır. Ödedim deyince herkesin ekranı anlık güncellenir (Supabase Realtime).

---

## 8. PAYLAŞIM KARTI, SOHBET VE LOG SİSTEMİ

Her paylaşım bir mini dosyadır ve uygulamanın sohbet mimarisi iki katmanlıdır (1-1 Özel Mesaj / DM KESİNLİKLE YOKTUR):

- **Gruba Özel Genel Sohbet:** Partinin ana iletişim kanalıdır ("Akşam 8'de çıkıyoruz, eksik var mı?"). WhatsApp gibi canlı (Realtime) çalışır.
- **Paylaşıma Özel Sohbet (Thread):** 1500₺'lik bir Migros paylaşımı açıldığında, _"O peyniri hesaptan düş"_ tartışması ana sohbeti kirletmez; paylaşımın altındaki kendi spesifik canlı sohbet alanında yapılır. Paylaşım "Ödendi / Kapandı" (Arşivlendi) yapıldığında bu sohbet kilitlenir (Read-only) ve salt okunur arşive kalkar. Yorumlara max 3 fotoğraf eklenebilir.
- **Ortak Finansal Log (Audit Log):** Finansal sonuç değiştiğinde eski hali yok edilemez. "Ahmet payını %33 -> %40 değiştirdi" silinemez şekilde loglanır.

---

## 9. KULLANICI PROFİLİ, DAVETLER VE GİZLİLİK (PRIVACY)

Kullanıcılar birbirleriyle sadece gruplar/partiler üzerinden iletişim kurabilir. Şimdilik sistemin tamamen online olduğunu varsayıyoruz.

- **Profil Detayları:** Uygulama içindeki bir yoruma veya isme tıklandığında kişinin profiline gidilir.
- **Gizlilik Ayarları:** Kişinin profilinde IBAN bilgisi ve "Karma (Güvenilirlik) Puanı" yer alır. Kullanıcı ayarlardan bu verileri "Herkese Açık", "Sadece Ortak Gruptakiler Görebilir" veya "Tamamen Gizli" yapabilir.
- **Arkadaş Ekleme ve "Davetlerim" Sayfası:** Kullanıcılar birbirlerini ID numaralarından (Örn: `Mert#1923`) bulup ekleyebilir ve bir partiye direkt davet edebilir. Bu davetler, uygulamanın ana menüsündeki yepyeni **"Davetlerim" (My Invites)** sayfasına veya bildirimlere düşer.

---

## 10. YOLCULUK VE ARAÇ MODÜLÜ (FUELSPLIT DNA)

- **Araç Profilleri:** 2021 Corolla, 1.5 Benzin, 7.2 L/100km (Varsayılan).
- **Rota ve Harita (Google Maps Platform):** Başlangıç ve bitiş seçilir. En hızlı, en ucuz, otoyolsuz alternatifleri çıkar.
- **Session Token Optimizasyonu:** API maliyetini düşürmek için her harf basışında API atılmaz, Places Autocomplete Session Token ile çalışır. KGM ücretleri (Türkiye) Google'da eksik olduğu için MVP'de manuel veya kendi veri tabanımızdan çekilir.
- **Tahmini vs Gerçek Tüketim:** "Tahmini tüketim 7.0L. Gerçek tüketim yol/hava şartına göre değişebilir." Gezi bitince "Gerçek maliyetleri gir" özelliği ile tahmin/gerçek farkı gösterilir. (Depo doldurma bilgisi girilirse sistem aracın gerçek yakıt ortalamasını hesaplayıp günceller).

---

## 11. BİLDİRİM VE SPAM KONTROLÜ (PUSH)

10 kişilik grupta biri yorum yapınca 9 kişiye bildirim gitmesi uygulamayı sildirir.

- Özelleştirilebilir ayarlar: Sadece borcum oluştuğunda bildir, yeni paylaşımlarda bildir vb.
- Supabase pg_cron + pg_net ile zamanlanmış push bildirimleri.

---

## 12. GENİŞLETİLMİŞ KATEGORİ VE VERİ YAPILARI (Metadata)

Sistemde ilk başta 3-4 kategori olacak olsa da, mimari aşağıdaki tüm varyasyonları esnek bir şekilde (JSONB veya relations ile) destekleyebilecek şekilde kurulacaktır.

- 🚗 **Ulaşım / Yolculuk:** Başlangıç-Bitiş konumu, Toplam KM, Araç id, Tahmini yakıt (L), Otoyol ücreti, Otopark.
- 🛒 **Market / Alışveriş:** Market adı, Fiş fotoğrafı, Ürün kalemleri (Itemized).
- 🍔 **Restoran / Yemek:** Mekan adı, Bahşiş tutarı, Sipariş kalemleri.
- 🏠 **Ev & Yaşam:** Fatura türü (Elektrik, Su), Fatura Dönemi (Örn: Eylül 2026), Son Ödeme Tarihi, Sayaç Endeksi.
- 🔄 **Abonelikler:** Servis adı (Netflix, Spotify), Döngü (Aylık/Yıllık).
- 🎟️ **Etkinlik / Eğlence:** Etkinlik adı, Bilet PNR, Lokasyon, Etkinlik tarihi.
- ✈️ **Tatil / Konaklama:** Otel adı, Kalınacak gün, Rezervasyon kodu.
- 💊 **Sağlık:** Eczane/Hastane adı, Muayene ücreti.
- 🎁 **Hediye:** Hediyenin alınacağı kişi, Özel gün türü (Doğum günü, Veda).
- 💸 **Nakit Borç / Avans:** Geri ödeme vadesi (Opsiyonel tarih), Sebebi.
- 📦 **Ödünç Eşya:** Eşyanın cinsi (Kamera, Matkap vb.), Eşyanın değeri, Geri verileceği tarih (Finansal olmayan paylaşım türü).
- ✏️ **Özel (Custom) Kategori:** İkon ve isim serbestçe seçilir, serbest metin notu girilir.

---

## 13. TASARIM SİSTEMİ: "SOFT SOCIAL" (KONSEPT B) VE SHARED COMPONENTS

Uygulamanın genel UX vizyonu **"2 Saniyede Paylaş"** üzerine kuruludur (Progressive Disclosure - her detayı girmek mümkün ama zorunlu değildir).

Tasarım felsefesi **"Sıcak, Samimi, Hızlı ve Göz Yormayan"** (Soft Social) olarak belirlenmiştir. Kurumsal bir banka uygulamasının soğukluğundan uzak; arkadaşça ve modern bir sosyal ağ (Airbnb/Splitwise hissi) deneyimi sunar.

### A. Renk ve Tema Felsefesi (Light & Dark Mod)

Keskin beyazlar veya zifiri siyahlar kullanılmaz. Göz yormayan, kontrastı dengelenmiş pastel/soft tonlar seçilir.

- **Arka Planlar (Background):**
  - _Light Mode:_ Kırık beyaz / Açık Krem (Örn: `#FAFAFA`). Kartlar saf beyaz (`#FFFFFF`) ve çok yumuşak/büyük gölgeli (`shadow-soft`).
  - _Dark Mode:_ Gece Mavisi / Koyu Slate (Örn: `#0F172A`). Kartlar bir ton açığı (`#1E293B`). Zifiri siyah kesinlikle yasak.
- **Form / Şekil Dili:** Keskin köşeler yoktur. Tüm kartlar, butonlar ve inputlar **yuvarlak hatlıdır** (Örn: `rounded-2xl` veya `rounded-3xl`).
- **Semantik Renkler (Soft Tonlar):**
  - 🟢 **Mint Yeşili (Alacak / Ödendi):** Çok sert yeşil yerine tatlı bir mint/zümrüt. (Light: `bg-emerald-100 text-emerald-700` | Dark: `bg-emerald-900/30 text-emerald-400`).
  - 🔴 **Soft Mercan / Rose (Borç / Hata):** Saldırgan bir kırmızı yerine pastel bir rose/mercan rengi. Para isteme gerginliğini azaltır.
  - 🔵 **İndigo / Soft Mavi (Marka / Ana Aksiyon):** "Ben Ödedim" butonu veya ana sekmeler için güven veren ama canlı bir mavi.
  - 🟡 **Amber (Bekleyen / Uyarı):** İşlem henüz onaylanmadıysa veya hesaplama yapılıyorsa.

### B. "Shared Components" (Ortak Bileşen) Planlaması

UI kod tekrarını önlemek ve tasarımı tek merkezden yönetmek için `src/components/shared/` altında şu bileşenler ilk günden inşa edilecektir:

1.  **`AmountBadge.tsx` (Tutar Rozeti):** İçine girilen sayı negatifse otomatik _Rose_, pozitifse _Mint_, sıfırsa _Gri_ rengini alan, parayı (₺) formatlayan akıllı rozet.
2.  **`Avatar.tsx`:** Kullanıcı fotoğraflarını gösterir. Eğer kullanıcı bir **"Hayalet (Temsili)"** profil ise, köşesine otomatik minik bir 👻 (hayalet) veya şeffaflık ikonu ekler.
3.  **`BottomSheet.tsx` (Mobilden Esinlenme):** "Yeni Paylaşım" butonuna basıldığında tüm ekranı kaplayan bir sayfa yerine, aşağıdan kayarak gelen (Swipeable) mobil hissiyatlı bir çekmece menü. Hız hissini artırır.
4.  **`SoftCard.tsx`:** Uygulamadaki tüm beyaz/slate kutuların standart sarmalayıcısı. İç boşlukları (padding) ve o meşhur "soft gölgeyi" tek merkezden uygular.
5.  **`EmptyState.tsx`:** Örneğin "Geçmiş paylaşım yok" ekranında sadece beyaz sayfa bırakmaz. Tatlı bir illüstrasyon (Örn: Uçan bir cüzdan) ve "Henüz bir harcama yok, ilk sen ateşle!" gibi samimi metinler içerir.
6.  **`Button.tsx` (Variant Destekli):** `solid` (Ana mavi buton), `soft` (Arka planı %20 şeffaf renkli buton - en çok bu kullanılacak) ve `ghost` (Arka plansız sadece ikon) varyasyonlarına sahip merkezi buton.

### C. Gelişmiş UI Ekstraları

- **İstatistikler (Premium):** Aylık/6 aylık harcama trendleri, en çok kime borçlanılmış vb. grafikler (Soft renklerle).
- **Story / Paylaşım Kartı (Viral Loop):** Gezi bittiğinde HD kalitede bir Instagram Story kartı (Toplam 8420₺, En çok ödeyen: Mert) oluşturulur.
- **Bölüşüm Şablonları:** "Ev" şablonu (Otomatik 3 kişi, eşit, yorum açık), "Yolculuk" şablonu (Araç sahibi öder, yakıt+yol).

---

## 14. 🤖 AI EKLEME FİKİRLERİ (SOSYAL DİNAMİKLER)

1.  **Karma (Güven) Puanı:** Kullanıcıların ödeme hızına göre sistemin onlara verdiği puan (Örn: %95 Güvenilir). Eğlenceli bir sosyal baskı unsuru.
2.  **Buzdolabı QR (Hızlı Şablon):** Ev grupları için çıktı alınabilen QR kod. Biri marketten gelip QR'ı okuttuğunda otomatik "Ev Market" taslağı açılır.
3.  **Ödeme Sataşması (Nudge):** Borcunu geciktirene sıkıcı bildirim yerine komik dürtmeler (Titreşim, komik GIF) gönderme.

---

## 15. TEKNİK MİMARİ VE VERİTABANI

- **Vercel (React+Vite) + Capacitor (Android/iOS) + Supabase** sacayağı. (Vardiyo'dan tamamen ayrı depo ve DB).
- **Veritabanı Uyarısı:** `participants` verisi asla tek bir JSONB kolonuna doldurulmayacak. İleride sorgu yapabilmek için ilişkisel (`share_participants`) kullanılacak.
- **RLS (Güvenlik):** Bütün koruma "Ben bu partinin üyesi miyim?" kontrolüne dayanır. (Supabase Row Level Security).
- **API Güvenliği:** Google Maps gibi API'ler frontend'de açık bırakılmayacak, Supabase Edge Functions üzerinden çağrılacak.

---

## 16. KESİN FAZLANDIRMA VE GELİŞTİRME YOL HARİTASI

_MVP'de ASLA Olmayacaklar: Navigasyon, canlı konum, OCR, AI, banka متنوعentegrasyonu, arkadaş listesi, halka açık partiler._

1.  [x] **Aşama 1 (UI ve Kurulum Tamamlandı, DB Başlayacak):** Supabase tabloları, Typescript pure fonksiyonları (`splitEqually`, `simplifyDebts`), RLS kuralları.
2.  **v0.1 (MVP - Çekirdek):** Auth, Parti kur, Kod ile katıl, Rol atamaları, Hayalet üye oluşturma ve "Claim Profile" altyapısı. Paylaşım oluştur (Eşit, Yüzde, Sabit), Ödeme statüleri, Loglama.
3.  **v0.2 (Gerçek Hayat & Yolculuk):** Araç profili, Google Maps (Places/Routes), Tahmini/Gerçek tutar farkı hesaplaması.
4.  **v0.3 (Market ve İçerik):** Fiş fotoğrafı (Sınır 3, max 800kb upload), yorumlaşma, ürün bazlı bölüşüm altyapısı.
5.  **v0.4 (Otomasyon):** Tekrarlayan paylaşımlar, Karma puanı, İstatistikler, Push bildirimleri.
6.  **v0.5 (Sosyal & Viral):** Story paylaşım kartları, Davet linkleri, QR Şablonlar, Nudge sistemi.
7.  **v1.0 (Gerçek Ürün):** Capacitor Android paketi, Premium (RevenueCat) katmanları (OCR vizyonu), Play Store yayın süreçleri.

> Bu planlama sırası kesinlikle bozulmayacaktır. Her bir faz, uygulamanın doğal büyüme döngüsü (Multiplayer Growth) gözetilerek sıralanmıştır.

## 17. WEB VE MOBİL STRATEJİSİ (CAPACITOR & VİRAL BÜYÜME)
Uygulama tamamen "Mobile-First" (Önce Mobil) olarak tasarlanacak ve Tailwind üzerinden max-w-md mx-auto ile sınırlandırılarak Web'de "ekran ortasında bir telefon uygulaması" gibi çalışacaktır. Sadece Mobil-App'e (Native) geçmek çok tehlikelidir çünkü uygulamayı indirmemiş olan arkadaş gruplarının anında gruba dahil olma hızını (viralliği) keser. Web versiyonu (Vercel) her zaman "Sürtünmesiz (Frictionless) Davet Kapısı" olarak canlı tutulacaktır.

