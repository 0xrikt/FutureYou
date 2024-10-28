import { Mail } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 h-screen flex flex-col items-center justify-center">
        <div className="text-center max-w-2xl mx-auto">
          {/* Icon */}
          <div className="mb-8 animate-fade-in">
            <Mail className="w-16 h-16 text-blue-500 mx-auto" />
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 animate-fade-in">
            来自未来的信
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fade-in">
            让十年后的自己，指引当下的选择
          </p>
          
          {/* Description */}
          <p className="text-gray-600 mb-12 leading-relaxed animate-fade-in">
            在人生的关键时刻，你是否希望能够预见未来？
            通过这封来自未来的信件，聆听不同选择后的自己会告诉你什么。
          </p>
          
          {/* CTA Button */}
          <a 
            href="/write"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
          >
            开始体验
          </a>

          {/* Quote */}
          <p className="mt-12 text-gray-500 italic animate-fade-in">
            "每一个选择都通向一个独特的未来"
          </p>
        </div>
      </div>
    </main>
  );
}