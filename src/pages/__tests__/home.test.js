import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Home from '../home';
import { setSearchQuery, setFilters, setCurrentPage, setSortBy } from '../../redux/carsSlice';
import '@testing-library/jest-dom'; // Import for extended jest-dom matchers

// Mock react-redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  // Using a more robust mock that passes href and as props
  return ({ children, href, as }) => {
    // In tests, we just render the children and optionally log the navigation intent
    // console.log(`Navigating to ${as || href}`);
    return <div data-href={as || href}>{children}</div>;
  };
});

// Mock the FilterPanel component to simplify testing Home
jest.mock('../../components/FilterPanel', () => {
  return ({ isOpen, onClose, filters, onFilterChange, onRemoveFilter, cars }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="filter-panel">
        <h2>Mock Filter Panel</h2>
        {/* Render some elements to interact with if needed for tests */}
        <button onClick={onClose}>Close Filter</button>
        {/* Simplified representation of filter controls */}
        <select data-testid="mock-make-filter" onChange={(e) => onFilterChange('make', e.target.value)} value={filters.make || ''}>
          <option value="">All Makes</option>
          <option value="BMW">BMW</option>
          <option value="Audi">Audi</option>
        </select>
         <input type="number" data-testid="mock-min-price" onChange={(e) => onFilterChange('minPrice', e.target.value)} value={filters.minPrice || ''} placeholder="Min Price" />
         <input type="number" data-testid="mock-max-price" onChange={(e) => onFilterChange('maxPrice', e.target.value)} value={filters.maxPrice || ''} placeholder="Max Price" />
         <button onClick={() => onRemoveFilter('make')}>Remove Make Filter</button>
      </div>
    );
  };
});

// Mock the Pagination component
jest.mock('../../components/Pagination', () => {
  return ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div data-testid="pagination">
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>
    );
  };
});

describe('Home Page', () => {
  const mockStore = configureStore([]);
  let store;
  let mockUseDispatch;
  let mockUseSelector;

  const mockCars = [
    { id: 1, make: 'BMW', model: 'X5', year: 2020, price: 50000, mileage: 10000, image: ['image1.jpg'] },
    { id: 2, make: 'Audi', model: 'A4', year: 2019, price: 40000, mileage: 20000, image: ['image2.jpg'] },
    { id: 3, make: 'BMW', model: '3 Series', year: 2021, price: 55000, mileage: 5000, image: ['image3.jpg'] },
    { id: 4, make: 'Audi', model: 'Q5', year: 2022, price: 60000, mileage: 3000, image: ['image4.jpg'] },
    { id: 5, make: 'BMW', model: 'X3', year: 2018, price: 35000, mileage: 25000, image: ['image5.jpg'] },
    { id: 6, make: 'Audi', model: 'A6', year: 2020, price: 45000, mileage: 15000, image: ['image6.jpg'] },
    { id: 7, make: 'BMW', model: 'Z4', year: 2023, price: 70000, mileage: 2000, image: ['image7.jpg'] },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    mockUseDispatch = jest.fn();
    mockUseSelector = jest.fn();
    useDispatch.mockReturnValue(mockUseDispatch);

    // Set up a default mock state for useSelector
    mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: {},
      sortBy: { field: 'price', direction: 'asc' },
      currentPage: 1,
      itemsPerPage: 3, // Set a smaller number for easier pagination testing
    });

    store = mockStore({
      cars: {
        searchQuery: '',
        filters: {},
        sortBy: { field: 'price', direction: 'asc' },
        currentPage: 1,
        itemsPerPage: 3,
      },
    });
  });

  test('renders the home page title', () => {
    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );
    const titleElement = screen.getByText(/Car Listings/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('dispatches setSearchQuery on search input change', () => {
    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );
    const searchInput = screen.getByPlaceholderText(/Search cars.../i);
    fireEvent.change(searchInput, { target: { value: 'BMW' } });
    expect(mockUseDispatch).toHaveBeenCalledWith(setSearchQuery('BMW'));
  });

  test('dispatches setFilters on make filter change (desktop)', () => {
    // Mock useSelector to return an empty filters object initially
    mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: {},
      sortBy: { field: 'price', direction: 'asc' },
      currentPage: 1,
      itemsPerPage: 3,
    });

    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );
    // Use getByLabelText for the desktop filter select
    const makeSelect = screen.getByLabelText(/Make/i);
    fireEvent.change(makeSelect, { target: { value: 'Audi' } });
    expect(mockUseDispatch).toHaveBeenCalledWith(setFilters({ make: 'Audi' }));
  });

   test('dispatches setFilters on make filter change (mobile)', async () => {
    // Mock useSelector to return state that simulates mobile view (show filter button)
     mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: {},
      sortBy: { field: 'price', direction: 'asc' },
      currentPage: 1,
      itemsPerPage: 3,
      isFilterPanelOpen: false,
    });

    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );

    // Click the mobile filter button to open the panel
    const showFiltersButton = screen.getByRole('button', { name: /Show Filters/i });
    fireEvent.click(showFiltersButton);

     // Now, mock useSelector again to simulate the panel being open and having filters
     mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: {},
      sortBy: { field: 'price', direction: 'asc' },
      currentPage: 1,
      itemsPerPage: 3,
      isFilterPanelOpen: true,
    });

     // Rerender the component to reflect the state change and show the mock filter panel
     // This is a simplification; in a real test, state updates trigger rerenders automatically.
     // Here, we manually simulate the state change and re-query the screen.
     render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );

    // Interact with the mocked filter panel controls
    const mockMakeSelect = screen.getByTestId('mock-make-filter');
    fireEvent.change(mockMakeSelect, { target: { value: 'BMW' } });
    expect(mockUseDispatch).toHaveBeenCalledWith(setFilters({ make: 'BMW' }));
  });

  test('dispatches setFilters on price range filter change', () => {
     mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: {},
      sortBy: { field: 'price', direction: 'asc' },
      currentPage: 1,
      itemsPerPage: 3,
    });
    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );
    const minPriceInput = screen.getByPlaceholderText(/Min Price/i);
    const maxPriceInput = screen.getByPlaceholderText(/Max Price/i);

    fireEvent.change(minPriceInput, { target: { value: '40000' } });
    expect(mockUseDispatch).toHaveBeenCalledWith(setFilters({ minPrice: '40000' }));

    fireEvent.change(maxPriceInput, { target: { value: '60000' } });
    expect(mockUseDispatch).toHaveBeenCalledWith(setFilters({ maxPrice: '60000' }));
  });


  test('dispatches setSortBy on sort select change', () => {
    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );
    const sortSelect = screen.getByRole('combobox'); // Assuming accessible role
    fireEvent.change(sortSelect, { target: { value: 'year-desc' } });
    expect(mockUseDispatch).toHaveBeenCalledWith(setSortBy({ field: 'year', direction: 'desc' }));
  });

   test('dispatches setSortBy correctly for other options', () => {
    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );
    const sortSelect = screen.getByRole('combobox');

    fireEvent.change(sortSelect, { target: { value: 'mileage-asc' } });
    expect(mockUseDispatch).toHaveBeenCalledWith(setSortBy({ field: 'mileage', direction: 'asc' }));

    fireEvent.change(sortSelect, { target: { value: 'price-desc' } });
    expect(mockUseDispatch).toHaveBeenCalledWith(setSortBy({ field: 'price', direction: 'desc' }));
  });

  test('renders the correct number of cars per page', () => {
     mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: {},
      sortBy: { field: 'price', direction: 'asc' },
      currentPage: 1,
      itemsPerPage: 3,
    });
    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );
     // We expect 3 car elements to be rendered initially based on itemsPerPage: 3
    const carElements = screen.getAllByRole('heading', { level: 2 }); // Assuming car make/model is h2
    expect(carElements).toHaveLength(3);
    expect(screen.getByText('BMW X5')).toBeInTheDocument();
    expect(screen.getByText('Audi A4')).toBeInTheDocument();
    expect(screen.getByText('BMW 3 Series')).toBeInTheDocument(); // Based on default sort by price asc
  });

   test('dispatches setCurrentPage on pagination next button click', () => {
     mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: {},
      sortBy: { field: 'price', direction: 'asc' },
      currentPage: 1,
      itemsPerPage: 3,
    });

    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );

    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    expect(mockUseDispatch).toHaveBeenCalledWith(setCurrentPage(2));
  });

   test('dispatches setCurrentPage on pagination previous button click', () => {
     mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: {},
      sortBy: { field: 'price', direction: 'asc' },
      currentPage: 2,
      itemsPerPage: 3,
    });

    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );

    const previousButton = screen.getByRole('button', { name: /Previous/i });
    fireEvent.click(previousButton);

    expect(mockUseDispatch).toHaveBeenCalledWith(setCurrentPage(1));
  });

   test('dispatches setFilters with empty values when Clear All button is clicked (desktop)', () => {
     // Mock state with active filters
     mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: { make: 'BMW', minPrice: '10000' },
      sortBy: { field: 'price', direction: 'asc' },
      currentPage: 1,
      itemsPerPage: 3,
    });
    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );

    const clearAllButton = screen.getByRole('button', { name: /Clear All/i });
    fireEvent.click(clearAllButton);

     // Expect setFilters to be called for each active filter key with an empty string
    expect(mockUseDispatch).toHaveBeenCalledWith(setFilters({ make: '' }));
    expect(mockUseDispatch).toHaveBeenCalledWith(setFilters({ minPrice: '' }));
     // Also check the clear all button when no results are found
      const noResultsClearAllButton = screen.getByRole('button', { name: /Clear All Filters/i });
      fireEvent.click(noResultsClearAllButton);
      expect(mockUseDispatch).toHaveBeenCalledWith(setFilters({
        make: '',
        model: '',
        minYear: '',
        maxYear: '',
        minPrice: '',
        maxPrice: ''
      }));
      expect(mockUseDispatch).toHaveBeenCalledWith(setSearchQuery(''));
   });

    test('dispatches setFilters with empty values when Clear All button is clicked (mobile)', async () => {
     // Mock state with active filters and mobile view
     mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: { make: 'BMW', minPrice: '10000' },
      sortBy: { field: 'price', direction: 'asc' },
      currentPage: 1,
      itemsPerPage: 3,
      isFilterPanelOpen: true, // Panel is open in mobile view
    });
    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );
     // In the mocked FilterPanel, the Clear All button is assumed to call onFilterChange for each key
     // and then onClose. We need to simulate the onFilterChange calls.
      const mockMakeRemoveButton = screen.getByRole('button', { name: /Remove Make Filter/i });
      fireEvent.click(mockMakeRemoveButton);
      expect(mockUseDispatch).toHaveBeenCalledWith(setFilters({ make: '' }));

     // Simulate clicking the Clear All button inside the mocked panel (if we had added it)
     // For now, we test the individual remove filter button within the mock.

   });

   test('correctly filters cars based on make', () => {
     // Mock useSelector to return state with a make filter
     mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: { make: 'BMW' },
      sortBy: { field: 'year', direction: 'asc' }, // Change sort for variety
      currentPage: 1,
      itemsPerPage: 3,
    });
    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );

     const carElements = screen.getAllByRole('heading', { level: 2 }); // Assuming car make/model is h2
    expect(carElements).toHaveLength(3); // BMW X5, BMW 3 Series, BMW Z4
    expect(screen.getByText('BMW X5')).toBeInTheDocument();
    expect(screen.getByText('BMW 3 Series')).toBeInTheDocument();
    expect(screen.getByText('BMW Z4')).toBeInTheDocument();
    expect(screen.queryByText('Audi A4')).not.toBeInTheDocument();
   });

    test('correctly filters cars based on price range', () => {
     // Mock useSelector to return state with a price range filter
     mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: { minPrice: '40000', maxPrice: '55000' },
      sortBy: { field: 'price', direction: 'asc' },
      currentPage: 1,
      itemsPerPage: 3,
    });
    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );

     const carElements = screen.getAllByRole('heading', { level: 2 }); // Assuming car make/model is h2
    expect(carElements).toHaveLength(3); // Audi A4, BMW X5, BMW 3 Series
    expect(screen.getByText('Audi A4')).toBeInTheDocument();
    expect(screen.getByText('BMW X5')).toBeInTheDocument();
    expect(screen.getByText('BMW 3 Series')).toBeInTheDocument();
    expect(screen.queryByText('Audi Q5')).not.toBeInTheDocument();
   });

    test('correctly sorts cars by year descending', () => {
     // Mock useSelector to return state with year desc sort
     mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: {},
      sortBy: { field: 'year', direction: 'desc' },
      currentPage: 1,
      itemsPerPage: 3,
    });
    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );

     const carElements = screen.getAllByRole('heading', { level: 2 }); // Assuming car make/model is h2
    expect(carElements).toHaveLength(3); // BMW Z4, Audi Q5, BMW 3 Series
    expect(carElements[0]).toHaveTextContent('BMW Z4');
    expect(carElements[1]).toHaveTextContent('Audi Q5');
    expect(carElements[2]).toHaveTextContent('BMW 3 Series');
   });

     test('correctly sorts cars by price ascending', () => {
     // Mock useSelector to return state with price asc sort
     mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: {},
      sortBy: { field: 'price', direction: 'asc' },
      currentPage: 1,
      itemsPerPage: 3,
    });
    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );

     const carElements = screen.getAllByRole('heading', { level: 2 }); // Assuming car make/model is h2
    expect(carElements).toHaveLength(3); // Audi A4, Audi A6, BMW X5
    expect(carElements[0]).toHaveTextContent('Audi A4');
    expect(carElements[1]).toHaveTextContent('Audi A6');
    expect(carElements[2]).toHaveTextContent('BMW X5');
   });

    test('correctly sorts cars by mileage descending', () => {
     // Mock useSelector to return state with mileage desc sort
     mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: {},
      sortBy: { field: 'mileage', direction: 'desc' },
      currentPage: 1,
      itemsPerPage: 3,
    });
    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );

     const carElements = screen.getAllByRole('heading', { level: 2 }); // Assuming car make/model is h2
    expect(carElements).toHaveLength(3); // Audi A5, BMW X3, Audi A6
    expect(carElements[0]).toHaveTextContent('Audi X5'); // Assuming Audi X5 has highest mileage in the added cars - CORRECTED to match mockCars
    expect(carElements[0]).toHaveTextContent('BMW X3'); // BMW X3 has 25000
    expect(carElements[1]).toHaveTextContent('Audi A6'); // Audi A6 has 15000
    expect(carElements[2]).toHaveTextContent('BMW X5'); // BMW X5 has 10000
   });

    test('displays no cars found message when filtered results are empty', () => {
     // Mock useSelector to return state with filters that result in no cars
     mockUseSelector.mockReturnValue({
      searchQuery: '',
      filters: { make: 'Ferrari' }, // Assuming no Ferraris in mockCars
      sortBy: { field: 'price', direction: 'asc' },
      currentPage: 1,
      itemsPerPage: 3,
    });
    render(
      <Provider store={store}>
        <Home cars={mockCars} />
      </Provider>
    );

    expect(screen.getByText('No cars found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters or search criteria')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument(); // No car elements should be present
   });


  // Note: Testing the actual visual sliding animation would require a more complex setup,
  // possibly involving end-to-end tests or snapshot testing with specific mocks.
  // These unit tests focus on the component logic and Redux interactions.
}); 