// Define mockDndRegistry at the top level so it's available to the hoisted mock factory.
const mockDndRegistry = {
  dropHandlers: new Map(),
  laneProps: new Map(),
};

// Mock react-dnd and its backend *before* any imports
jest.mock('react-dnd', () => {
  console.log('[TEST MOCK] Mocking react-dnd module at the VERY TOP');
  return {
    DragDropContext: jest.fn((backend) => {
      console.log('[TEST MOCK] DragDropContext HOC called with backend:', backend ? backend.constructor.name : backend);
      return jest.fn((DecoratedComponent) => {
        console.log('[TEST MOCK] DragDropContext inner HOC called to wrap:', DecoratedComponent.displayName || DecoratedComponent.name);
        const WrappedComponent = (props) => <DecoratedComponent {...props} />;
        WrappedComponent.displayName = `MockedDDC(${DecoratedComponent.displayName || DecoratedComponent.name || 'Component'})`;
        return WrappedComponent;
      });
    }),
    DragSource: jest.fn((type, spec, collect) => (DecoratedComponent) => {
      console.log('[TEST MOCK] DragSource HOC called to wrap:', DecoratedComponent.displayName || DecoratedComponent.name);
      const WrappedComponent = (props) => {
        const mockConnect = {
          dragSource: jest.fn().mockReturnValue(node => node), // Corrected: returns a function
          dragPreview: jest.fn().mockReturnValue(node => node), // Corrected: returns a function
        };
        const mockMonitor = {
          canDrag: jest.fn(() => true),
          isDragging: jest.fn(() => false), 
          getItemType: jest.fn(() => type),
          getItem: jest.fn(() => null), // Simplified as per subtask suggestion
          didDrop: jest.fn(() => false),
          // getDropResult is not strictly needed by card.jsx's collect
        };
        const collectedProps = collect(mockConnect, mockMonitor);
        return <DecoratedComponent {...props} {...collectedProps} />;
      };
      WrappedComponent.displayName = `DragSource(${DecoratedComponent.displayName || DecoratedComponent.name || 'Component'})`;
      return WrappedComponent;
    }),
    DropTarget: jest.fn((type, spec, collect) => (DecoratedComponent) => {
      console.log('[TEST MOCK] DropTarget HOC called to wrap:', DecoratedComponent.displayName || DecoratedComponent.name);
      const WrappedComponent = (props) => {
        const mockConnect = {
          dropTarget: jest.fn().mockReturnValue(el => el), // Corrected: returns a function
        };
        const mockMonitor = {
          canDrop: jest.fn(() => true),
          isOver: jest.fn(() => false),
          getItem: jest.fn(() => null),
          getItemType: jest.fn(() => null),
          didDrop: jest.fn(() => false),
        };
        // Log the mockConnect object itself for the problematic DropTarget(Lane)
        if ((DecoratedComponent.displayName || DecoratedComponent.name) === 'Lane') {
          console.log(`[TEST MOCK] DropTarget for Lane: mockConnect.dropTarget is`, typeof mockConnect.dropTarget, mockConnect.dropTarget);
        }
        const collectedProps = collect(mockConnect, mockMonitor);
        console.log(`[TEST MOCK] DropTarget for ${DecoratedComponent.displayName || DecoratedComponent.name}: collectedProps`, collectedProps);
        
        // Access mockDndRegistry (now defined at top level)
        if (mockDndRegistry.dropHandlers && spec.drop) {
            const key = props.title !== undefined ? props.title : props.laneIdx;
            if (key !== undefined) {
                mockDndRegistry.dropHandlers.set(key, (monitor) => spec.drop(props, monitor, null));
                if (mockDndRegistry.laneProps) { 
                    mockDndRegistry.laneProps.set(key, props);
                }
            }
        }
        return <DecoratedComponent {...props} {...collectedProps} />; 
      };
      WrappedComponent.displayName = `DropTarget(${DecoratedComponent.displayName || DecoratedComponent.name || 'Component'})`;
      return WrappedComponent;
    }),
  };
});

// Mock HTML5Backend to be a simple function, as DragDropContext expects a backend.
jest.mock('react-dnd-html5-backend', () => {
  console.log('[TEST MOCK] Mocking react-dnd-html5-backend at the VERY TOP');
  return jest.fn(() => ({ /* dummy backend instance if needed */ }));
});

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom'; // for extended matchers like .toBeInTheDocument()
import Board from './board';

// mockDndRegistry is now defined at the top.

describe('Board Component', () => {
  // mockDndRegistry was moved to the top.

  it('should allow adding a new card to a lane', () => {
    render(<Board />);

    // Find the "Planned" lane
    const plannedLane = screen.getByText('Planned').closest('.lane');
    expect(plannedLane).toBeInTheDocument();

    // --- Part 1: Check initial card count (optional, but good for verification) ---
    // Get all card elements within the "Planned" lane.
    // Note: querySelectorAll returns a NodeList, not an array.
    // We filter out the placeholder itself if it's counted as a .card
    const initialCards = plannedLane.querySelectorAll('.card:not(.card--placeholder)');
    const initialCardsInPlannedLane = initialCards.length;

    // --- Part 2: Activate the CardPlaceholder form ---
    // Find the CardPlaceholder in its inactive state within the "Planned" lane
    const addCardButtonInactive = within(plannedLane).getByText('+');
    fireEvent.click(addCardButtonInactive);

    // --- Part 3: Fill in the form and submit ---
    // Find the input fields and save button now that the form is active
    const titleInput = within(plannedLane).getByPlaceholderText('Title');
    const descriptionInput = within(plannedLane).getByPlaceholderText('Description');
    const saveButton = within(plannedLane).getByRole('button', { name: 'Save' });

    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();

    const testTitle = 'New Test Card';
    const testDescription = 'Test Description';

    fireEvent.change(titleInput, { target: { value: testTitle } });
    fireEvent.change(descriptionInput, { target: { value: testDescription } });
    fireEvent.click(saveButton);

    // --- Part 4: Assert the new card is present ---
    // Verify that the number of actual cards in the "Planned" lane has increased by 1
    const finalCards = plannedLane.querySelectorAll('.card:not(.card--placeholder)');
    expect(finalCards.length).toBe(initialCardsInPlannedLane + 1);

    // Verify the new card's content is in the document and within the "Planned" lane
    expect(within(plannedLane).getByText(testTitle)).toBeInTheDocument();
    expect(within(plannedLane).getByText(testDescription)).toBeInTheDocument();

    // Also, check that the placeholder form is closed (optional)
    expect(within(plannedLane).getByText('+')).toBeInTheDocument(); // Placeholder is back to '+'
    expect(within(plannedLane).queryByPlaceholderText('Title')).not.toBeInTheDocument(); // Title input is gone
  });

  beforeEach(() => {
    // Clear maps before each test (mockDndRegistry is now top-level)
    mockDndRegistry.dropHandlers.clear();
    mockDndRegistry.laneProps.clear();
  });

  it('should allow moving a card from one lane to another', () => {
    render(<Board />);

    // Initial state: Card "Expand the deck" is in "Planned" (laneIdx 0, cardIdx 0)
    const plannedLaneQuery = () => screen.getByText('Planned').closest('.lane');
    const designLaneQuery = () => screen.getByText('Design').closest('.lane');

    expect(within(plannedLaneQuery()).getByText('Expand the deck')).toBeInTheDocument();
    expect(within(designLaneQuery()).queryByText('Expand the deck')).not.toBeInTheDocument();

    const initialPlannedCards = plannedLaneQuery().querySelectorAll('.card:not(.card--placeholder)').length;
    const initialDesignCards = designLaneQuery().querySelectorAll('.card:not(.card--placeholder)').length;

    // Simulate dragging "Expand the deck" (cardIdx 0 from laneIdx 0) to "Design" (laneIdx 1)
    const mockMonitor = {
      getItem: () => ({ 
        // These are details of the *dragged item* (the Card)
        // Based on board.jsx initial state:
        // 'Expand the deck' is cards[0] in 'Planned' (statuses[0])
        title: 'Expand the deck', 
        description: 'Add a new section to the deck to make room for a grill and hammock.',
        cardIdx: 0, // Original index in "Planned" lane
        laneIdx: 0  // Original lane index ("Planned")
      }),
      didDrop: () => false, // Important for the drop handler in lane.jsx
    };

    // Get the drop handler for the "Design" lane from our mock registry
    // The key 'Design' corresponds to props.title of the Lane component
    const designLaneDropHandler = mockDndRegistry.dropHandlers.get('Design');
    expect(designLaneDropHandler).toBeDefined();

    // Call the drop handler for the "Design" lane
    // This will internally call moveCard(item.laneIdx, props.laneIdx, item.cardIdx)
    // where item.laneIdx = 0 (Planned), props.laneIdx = 1 (Design), item.cardIdx = 0
    designLaneDropHandler(mockMonitor);
    
    // Assertions after drop
    // Card should no longer be in "Planned"
    expect(within(plannedLaneQuery()).queryByText('Expand the deck')).not.toBeInTheDocument();
    
    // Card should now be in "Design"
    expect(within(designLaneQuery()).getByText('Expand the deck')).toBeInTheDocument();
    // Optionally, check its description too if needed
    expect(within(designLaneQuery()).getByText('Add a new section to the deck to make room for a grill and hammock.')).toBeInTheDocument();

    // Check card counts
    const finalPlannedCards = plannedLaneQuery().querySelectorAll('.card:not(.card--placeholder)').length;
    const finalDesignCards = designLaneQuery().querySelectorAll('.card:not(.card--placeholder)').length;

    expect(finalPlannedCards).toBe(initialPlannedCards - 1);
    expect(finalDesignCards).toBe(initialDesignCards + 1);
  });
});
