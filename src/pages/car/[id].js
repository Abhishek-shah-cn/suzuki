import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '../../components/atoms/Breadcrumb';

export default function CarDetails({ car }) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!car) {
    return <div className="text-center py-8">Car not found</div>;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === car.image.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? car.image.length - 1 : prev - 1
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Car Listings', href: '/home' },
          { label: `${car.make} ${car.model}`, href: `/car/${car.id}` }
        ]}
      />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Carousel */}
        <div className="relative h-96">
          <img
            src={car.image[currentImageIndex]}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
          />
          {car.image.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {car.image.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Car Details */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {car.make} {car.model} {car.year}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Information</h2>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <span className="font-medium">Price:</span> ${car.price.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Mileage:</span> {car.mileage.toLocaleString()} miles
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Year:</span> {car.year}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Make:</span> {car.make}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Model:</span> {car.model}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
              <div className="space-y-3">
                {car.specifications && Object.entries(car.specifications).map(([key, value]) => (
                  <p key={key} className="text-gray-600">
                    <span className="font-medium">{key}:</span> {value}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {car.description && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600">{car.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const response = await fetch('https://arpitjoshi.github.io/8e4474f3-d675-44c2-ba12-ccfacfa97c8b.json');
    const cars = await response.json();
   
    const car = cars.find(c => c.id === parseInt(params.id));

    return {
      props: {
        car: car || null,
      },
    };
  } catch (error) {
    console.error('Error fetching car details:', error);
    return {
      props: {
        car: null,
      },
    };
  }
} 