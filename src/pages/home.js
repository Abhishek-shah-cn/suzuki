import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setFilters, setCurrentPage, setSortBy } from '../redux/carsSlice';
import Link from 'next/link';
import Image from 'next/image';
import Pagination from '../components/organism/Pagination';
import Breadcrumb from '../components/atoms/Breadcrumb';
import FilterPanel from '../components/organism/FilterPanel';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Home({ cars }) {
  const dispatch = useDispatch();
  const { searchQuery, filters, sortBy, currentPage, itemsPerPage } = useSelector((state) => state.cars);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const filteredCars = cars?.filter((car) => {
    const matchesSearch = 
      car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.year.toString().includes(searchQuery);

    const matchesFilters = 
      (!filters.make || car.make.toLowerCase() === filters.make.toLowerCase()) &&
      (!filters.model || car.model.toLowerCase() === filters.model.toLowerCase()) &&
      (!filters.year || car.year.toString() === filters.year) &&
      (!filters.minPrice || car.price >= parseInt(filters.minPrice)) &&
      (!filters.maxPrice || car.price <= parseInt(filters.maxPrice));

    return matchesSearch && matchesFilters;
  });

  // Sort the filtered cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    const direction = sortBy.direction === 'asc' ? 1 : -1;
    if (sortBy.field === 'price' || sortBy.field === 'year' || sortBy.field === 'mileage') {
      return (a[sortBy.field] - b[sortBy.field]) * direction;
    }
    return a[sortBy.field].localeCompare(b[sortBy.field]) * direction;
  });

  const totalPages = Math.ceil(sortedCars.length / itemsPerPage);
  const paginatedCars = sortedCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleFilter = (type, value) => {
    dispatch(setFilters({ [type]: value }));
  };

  const handleSort = (field) => {
    dispatch(setSortBy({
      field,
      direction: sortBy.field === field && sortBy.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleRemoveFilter = (key) => {
    dispatch(setFilters({ [key]: '' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-blue-100 to-purple-100">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-50 backdrop-blur-sm  -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <Image
              src="https://www.suzuki-digital.com/assets/frontend/images/suzuki-mobile-logo.svg"
              alt="Suzuki Logo"
              width={200}
              height={60}
              priority
              className="object-contain hover:opacity-90 transition-opacity"
            />
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cars..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-3 pl-10 border-2 border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Car Listings', href: '/home' }
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Filters */}
        <div className="lg:w-1/4 hidden lg:block">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                <select
                  value={filters.make}
                  onChange={(e) => handleFilter('make', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Makes</option>
                  {[...new Set(cars.map(car => car.make))].map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <select
                  value={filters.model}
                  onChange={(e) => handleFilter('model', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Models</option>
                  {[...new Set(cars.map(car => car.model))].map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min Year"
                    value={filters.minYear}
                    onChange={(e) => handleFilter('minYear', e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max Year"
                    value={filters.maxYear}
                    onChange={(e) => handleFilter('maxYear', e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilter('minPrice', e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilter('maxPrice', e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Product Listings */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
          
            
            <div className="relative">
              <select
                value={`${sortBy.field}-${sortBy.direction}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  dispatch(setSortBy({ field, direction }));
                }}
                className="appearance-none px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Year: Newest First</option>
                <option value="year-asc">Year: Oldest First</option>
                <option value="mileage-asc">Mileage: Low to High</option>
                <option value="mileage-desc">Mileage: High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Active Filters Section */}
          {(filters.make || filters.model || filters.minYear || filters.maxYear || filters.minPrice || filters.maxPrice) && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-700">Active Filters:</h3>
                <button
                  onClick={() => {
                    dispatch(setFilters({
                      make: '',
                      model: '',
                      minYear: '',
                      maxYear: '',
                      minPrice: '',
                      maxPrice: ''
                    }));
                  }}
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.make && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Make: {filters.make}
                    <button
                      onClick={() => handleRemoveFilter('make')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.model && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Model: {filters.model}
                    <button
                      onClick={() => handleRemoveFilter('model')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(filters.minYear || filters.maxYear) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Year: {filters.minYear || 'Any'} - {filters.maxYear || 'Any'}
                    <button
                      onClick={() => {
                        handleRemoveFilter('minYear');
                        handleRemoveFilter('maxYear');
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Price: ${filters.minPrice || '0'} - ${filters.maxPrice || 'Any'}
                    <button
                      onClick={() => {
                        handleRemoveFilter('minPrice');
                        handleRemoveFilter('maxPrice');
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsFilterPanelOpen(true)}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              Show Filters
            </button>
          </div>

          {paginatedCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-64 h-64">
                <DotLottieReact
                  src="https://lottie.host/70b6f9c4-ee2b-49ca-9e6c-886a10ba84a8/7lr0rLg6eO.lottie"
                  loop
                  autoplay
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mt-4">No cars found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria</p>
              <button
                onClick={() => {
                  dispatch(setFilters({
                    make: '',
                    model: '',
                    minYear: '',
                    maxYear: '',
                    minPrice: '',
                    maxPrice: ''
                  }));
                  dispatch(setSearchQuery(''));
                }}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {paginatedCars.map((car) => (
                <div 
                  key={car.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link href={`/car/${car.id}`}>
                    <div className="cursor-pointer">
                      <img 
                        src={car.image[0]} 
                        alt={`${car.make} ${car.model}`} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{car.make} {car.model}</h2>
                        <p className="text-gray-600 mb-1">Year: {car.year}</p>
                        <p className="text-gray-600 mb-1">Price: ${car.price.toLocaleString()}</p>
                        <p className="text-gray-600">Mileage: {car.mileage.toLocaleString()} miles</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {paginatedCars.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Panel (opens from bottom) */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        onFilterChange={handleFilter}
        onRemoveFilter={handleRemoveFilter}
        cars={cars}
      />
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const response = await fetch('https://arpitjoshi.github.io/8e4474f3-d675-44c2-ba12-ccfacfa97c8b.json');
    const cars = await response.json();
    
    return {
      props: {
        cars,
      },
    };
  } catch (error) {
    console.error('Error fetching cars:', error);
    return {
      props: {
        cars: [],
      },
    };
  }
}
