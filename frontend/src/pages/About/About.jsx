const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-700">
              Hakkımızda
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            MucizeOl - Hayvan Sahiplendirme Platformu
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M11 3.055V5a2 2 0 002 2h1a2 2 0 002 2 2 2 0 002 2h2.945M21 12.945V19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-1a2 2 0 00-2-2h-1a2 2 0 00-2 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-2.945M21 12V9a2 2 0 00-2-2h-1a2 2 0 00-2 2v1a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 00-2-2H4a2 2 0 00-2 2v3.945" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                MucizeOl olarak, her hayvanın sevgi dolu bir yuvaya kavuşmasını sağlamak için çalışıyoruz. 
                Platformumuz, hayvan sahiplendirme sürecini güvenli, kolay ve şeffaf hale getirerek, 
                hem hayvanların hem de ailelerin hayatlarında pozitif bir değişim yaratmayı hedefliyor.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong className="text-primary-600">Bir hayvana mucize olmak, bir hayvanın da bize mucize olabileceği</strong> 
                inancıyla, her gün daha fazla hayvanın yeni ailesine kavuşması için çalışıyoruz.
              </p>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Vizyonumuz</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Türkiye'nin en güvenilir ve kapsamlı hayvan sahiplendirme platformu olmak. 
                Teknolojiyi kullanarak, hayvan sahiplendirme sürecini dijitalleştirip, 
                daha fazla hayvanın sevgi dolu bir yuvaya kavuşmasını sağlamak.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Değerlerimiz</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Güvenlik</h3>
              <p className="text-gray-700">
                Tüm işlemlerimiz güvenli ve şeffaf bir şekilde yürütülür.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Kolaylık</h3>
              <p className="text-gray-700">
                Basit ve kullanıcı dostu arayüzümüzle herkes kolayca kullanabilir.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sevgi</h3>
              <p className="text-gray-700">
                Her hayvanın sevgi dolu bir yuvaya kavuşması için çalışıyoruz.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Nasıl Çalışır?</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">İlan Oluştur</h3>
                <p className="text-gray-700">
                  Sahiplendirmek istediğiniz hayvan için detaylı bir ilan oluşturun. Fotoğraf ve bilgileri ekleyin.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Talepleri İncele</h3>
                <p className="text-gray-700">
                  İlanınıza gelen sahiplenme taleplerini inceleyin ve en uygun aileyi seçin.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Yeni Yuva</h3>
                <p className="text-gray-700">
                  Talebi onayladığınızda, hayvanınız sevgi dolu yeni ailesine kavuşur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

