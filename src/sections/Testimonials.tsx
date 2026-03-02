import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { testimonials } from '@/data/mockData';

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: carouselRef, isVisible: carouselVisible } = useScrollAnimation({ threshold: 0.1 });

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Get visible testimonials (current, prev, next)
  const getVisibleTestimonials = () => {
    const prev = (currentIndex - 1 + testimonials.length) % testimonials.length;
    const next = (currentIndex + 1) % testimonials.length;
    return [
      { ...testimonials[prev], position: 'left' },
      { ...testimonials[currentIndex], position: 'center' },
      { ...testimonials[next], position: 'right' },
    ];
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#007fff] to-[#00bfff] mx-auto rounded-full mb-4" />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mais de 50.000 downloads realizados com sucesso e clientes satisfeitos
          </p>
        </div>

        {/* Carousel */}
        <div 
          ref={carouselRef}
          className={`relative transition-all duration-700 ${
            carouselVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Desktop 3D Carousel */}
          <div className="hidden md:block relative h-[400px] perspective-[1500px]">
            {getVisibleTestimonials().map((testimonial, idx) => {
              const isCenter = testimonial.position === 'center';
              const isLeft = testimonial.position === 'left';
              
              return (
                <div
                  key={`${testimonial.id}-${idx}`}
                  onClick={() => !isCenter && handleDotClick(
                    isLeft 
                      ? (currentIndex - 1 + testimonials.length) % testimonials.length
                      : (currentIndex + 1) % testimonials.length
                  )}
                  className={`absolute top-1/2 left-1/2 w-full max-w-lg transition-all duration-600 cursor-pointer ${
                    isCenter 
                      ? '-translate-x-1/2 -translate-y-1/2 z-20 scale-100 opacity-100'
                      : isLeft
                        ? '-translate-x-[120%] -translate-y-1/2 z-10 scale-90 opacity-60 -rotate-y-35'
                        : 'translate-x-[20%] -translate-y-1/2 z-10 scale-90 opacity-60 rotate-y-35'
                  }`}
                  style={{
                    transform: isCenter 
                      ? 'translate(-50%, -50%) rotateY(0deg) scale(1)'
                      : isLeft
                        ? 'translate(-130%, -50%) rotateY(35deg) scale(0.85)'
                        : 'translate(30%, -50%) rotateY(-35deg) scale(0.85)',
                  }}
                >
                  <div className={`bg-white rounded-3xl p-8 shadow-xl transition-shadow duration-300 ${
                    isCenter ? 'shadow-2xl shadow-blue-500/10' : 'shadow-lg'
                  }`}>
                    {/* Quote Icon */}
                    <Quote className="w-10 h-10 text-[#007fff]/20 mb-4" />
                    
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                      "{testimonial.comment}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        {testimonial.manualPurchased && (
                          <p className="text-sm text-gray-500">
                            Comprou: {testimonial.manualPurchased}
                          </p>
                        )}
                      </div>
                      {testimonial.verified && (
                        <div className="ml-auto flex items-center gap-1 text-green-600 text-sm">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verificado
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Single Card */}
          <div className="md:hidden">
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-[#007fff]/20 mb-4" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonials[currentIndex].rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 leading-relaxed mb-6">
                "{testimonials[currentIndex].comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[currentIndex].avatar}
                  alt={testimonials[currentIndex].name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonials[currentIndex].name}</p>
                  {testimonials[currentIndex].manualPurchased && (
                    <p className="text-sm text-gray-500">
                      Comprou: {testimonials[currentIndex].manualPurchased}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="rounded-full hover:bg-[#007fff] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-[#007fff] w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full hover:bg-[#007fff] hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
