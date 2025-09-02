import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard from '../PropertyCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Property {
  id: string;
  title: string;
  address?: string;
  city?: string;
  region?: string;
  location?: string;
  propertyType?: string;
  property_type?: string;
  contractType?: string;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  area_sqm?: number;
  coordinates?: { lat: number; lng: number; };
  images?: string[];
  image_url?: string;
  badges?: string[];
  featured?: boolean;
  isNew?: boolean;
  price: number;
  priceHidden?: boolean;
  description?: string;
}

interface ClassicCarouselProps {
  properties: Property[];
}

export function ClassicCarousel({ properties }: ClassicCarouselProps) {
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const swiperRef = useRef<any>(null);

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Proprietà Selezionate</h3>
          <p className="text-gray-600">Scorri per esplorare tutte le nostre migliori offerte</p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setIsAutoPlayEnabled(!isAutoPlayEnabled);
              if (swiperRef.current) {
                if (isAutoPlayEnabled) {
                  swiperRef.current.autoplay.stop();
                } else {
                  swiperRef.current.autoplay.start();
                }
              }
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isAutoPlayEnabled
                ? 'bg-[#e3ae61] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isAutoPlayEnabled ? 'Pausa' : 'Play'}
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative group">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-gray-300',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-[#e3ae61]',
          }}
          navigation={{
            prevEl: '.carousel-prev',
            nextEl: '.carousel-next',
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="!pb-12 equal-height-swiper"
        >
          {properties.map((property) => (
            <SwiperSlide key={property.id}>
              <PropertyCard
                property={property}
                className="h-full flex flex-col"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <button className="carousel-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100">
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button className="carousel-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-[#e3ae61] mb-2">{properties.length}</div>
          <div className="text-gray-600 text-sm">Proprietà Totali</div>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {Math.round(properties.reduce((acc, p) => acc + p.price, 0) / properties.length / 1000)}K
          </div>
          <div className="text-gray-600 text-sm">Prezzo Medio</div>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {Math.round(properties.reduce((acc, p) => acc + (p.area || p.area_sqm || 0), 0) / properties.length)}
          </div>
          <div className="text-gray-600 text-sm">m² Medio</div>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {new Set(properties.map(p => p.region || p.city)).size}
          </div>
          <div className="text-gray-600 text-sm">Città</div>
        </div>
      </div>
    </div>
  );
}