import React from 'react';
import { Check } from 'lucide-react';

interface IssueDefinitionProps {
    selectedIssue: string | null;
    onSelect: (issue: string) => void;
    subCategory: string; // To potentially filter issues
}

// Mock data mapping sub-categories to issues
const issuesMap: Record<string, Array<{ id: string; label: string }>> = {
    // Appliances
    refrigerator: [
        { id: 'temperature', label: 'Temperature' },
        { id: 'freezer', label: 'Freezer' },
        { id: 'shelves', label: 'Shelves' },
        { id: 'light', label: 'Light' },
        { id: 'handle', label: 'Handle' },
        { id: 'noise', label: 'Noise' },
        { id: 'leaking', label: 'Leaking' },
    ],
    dishwasher: [
        { id: 'not_cleaning', label: 'Not Cleaning' },
        { id: 'not_draining', label: 'Not Draining' },
        { id: 'leaking', label: 'Leaking' },
        { id: 'door', label: 'Door Issue' },
        { id: 'noise', label: 'Noise' },
    ],
    oven_stove: [
        { id: 'not_heating', label: 'Not Heating' },
        { id: 'burner', label: 'Burner Issue' },
        { id: 'door', label: 'Door Issue' },
        { id: 'igniter', label: 'Igniter' },
        { id: 'temperature', label: 'Temperature Control' },
    ],
    laundry: [
        { id: 'not_spinning', label: 'Not Spinning' },
        { id: 'not_draining', label: 'Not Draining' },
        { id: 'leaking', label: 'Leaking' },
        { id: 'noise', label: 'Noise' },
        { id: 'door', label: 'Door Issue' },
    ],
    water_heater: [
        { id: 'no_hot_water', label: 'No Hot Water' },
        { id: 'insufficient_heat', label: 'Insufficient Heat' },
        { id: 'leaking', label: 'Leaking' },
        { id: 'noise', label: 'Noise' },
        { id: 'pilot_light', label: 'Pilot Light' },
    ],
    cooling: [
        { id: 'not_cooling', label: 'Not Cooling' },
        { id: 'noise', label: 'Noise' },
        { id: 'leaking', label: 'Leaking' },
        { id: 'thermostat', label: 'Thermostat' },
        { id: 'filter', label: 'Filter' },
    ],
    // Electrical
    outlet: [
        { id: 'not_working', label: 'Not Working' },
        { id: 'loose', label: 'Loose' },
        { id: 'sparking', label: 'Sparking' },
        { id: 'burnt', label: 'Burnt' },
    ],
    lighting: [
        { id: 'not_working', label: 'Not Working' },
        { id: 'flickering', label: 'Flickering' },
        { id: 'buzzing', label: 'Buzzing' },
        { id: 'fixture_damaged', label: 'Fixture Damaged' },
    ],
    circuit_breaker: [
        { id: 'tripping', label: 'Tripping' },
        { id: 'not_resetting', label: 'Not Resetting' },
        { id: 'burnt', label: 'Burnt' },
    ],
    wiring: [
        { id: 'exposed', label: 'Exposed Wires' },
        { id: 'damaged', label: 'Damaged' },
        { id: 'smell', label: 'Burning Smell' },
    ],
    switches: [
        { id: 'not_working', label: 'Not Working' },
        { id: 'loose', label: 'Loose' },
        { id: 'sparking', label: 'Sparking' },
    ],
    // Exterior
    roof: [
        { id: 'leaking', label: 'Leaking' },
        { id: 'damaged_shingles', label: 'Damaged Shingles' },
        { id: 'sagging', label: 'Sagging' },
        { id: 'gutters', label: 'Gutters' },
    ],
    doors: [
        { id: 'not_closing', label: 'Not Closing' },
        { id: 'lock', label: 'Lock Issue' },
        { id: 'damaged', label: 'Damaged' },
        { id: 'weatherstripping', label: 'Weatherstripping' },
    ],
    windows: [
        { id: 'broken_glass', label: 'Broken Glass' },
        { id: 'not_opening', label: 'Not Opening' },
        { id: 'lock', label: 'Lock Issue' },
        { id: 'seal', label: 'Seal Issue' },
    ],
    siding: [
        { id: 'damaged', label: 'Damaged' },
        { id: 'loose', label: 'Loose' },
        { id: 'missing', label: 'Missing' },
    ],
    gutters: [
        { id: 'clogged', label: 'Clogged' },
        { id: 'leaking', label: 'Leaking' },
        { id: 'sagging', label: 'Sagging' },
        { id: 'damaged', label: 'Damaged' },
    ],
    // Household
    doors_interior: [
        { id: 'not_closing', label: 'Not Closing' },
        { id: 'damaged', label: 'Damaged' },
        { id: 'handle', label: 'Handle Issue' },
        { id: 'hinge', label: 'Hinge Issue' },
    ],
    windows_interior: [
        { id: 'broken', label: 'Broken' },
        { id: 'not_opening', label: 'Not Opening' },
        { id: 'lock', label: 'Lock Issue' },
    ],
    closets: [
        { id: 'door', label: 'Door Issue' },
        { id: 'shelves', label: 'Shelves' },
        { id: 'rod', label: 'Rod' },
    ],
    flooring: [
        { id: 'damaged', label: 'Damaged' },
        { id: 'loose', label: 'Loose' },
        { id: 'stained', label: 'Stained' },
        { id: 'squeaking', label: 'Squeaking' },
    ],
    pest_control: [
        { id: 'rodents', label: 'Rodents' },
        { id: 'insects', label: 'Insects' },
        { id: 'termites', label: 'Termites' },
        { id: 'other', label: 'Other Pests' },
    ],
    // Outdoors
    landscaping: [
        { id: 'overgrown', label: 'Overgrown' },
        { id: 'dead_plants', label: 'Dead Plants' },
        { id: 'weeds', label: 'Weeds' },
        { id: 'tree_trimming', label: 'Tree Trimming' },
    ],
    fencing: [
        { id: 'damaged', label: 'Damaged' },
        { id: 'leaning', label: 'Leaning' },
        { id: 'missing_sections', label: 'Missing Sections' },
        { id: 'gate', label: 'Gate Issue' },
    ],
    pool: [
        { id: 'pump', label: 'Pump' },
        { id: 'filter', label: 'Filter' },
        { id: 'leaking', label: 'Leaking' },
        { id: 'cleaning', label: 'Cleaning' },
    ],
    porch: [
        { id: 'damaged_boards', label: 'Damaged Boards' },
        { id: 'railing', label: 'Railing' },
        { id: 'steps', label: 'Steps' },
    ],
    parking: [
        { id: 'cracks', label: 'Cracks' },
        { id: 'potholes', label: 'Potholes' },
        { id: 'drainage', label: 'Drainage' },
    ],
    // Plumbing
    sink: [
        { id: 'clogged', label: 'Clogged' },
        { id: 'leaking', label: 'Leaking' },
        { id: 'faucet', label: 'Faucet Issue' },
        { id: 'drain', label: 'Drain Issue' },
    ],
    toilet: [
        { id: 'clogged', label: 'Clogged' },
        { id: 'running', label: 'Running' },
        { id: 'leaking', label: 'Leaking' },
        { id: 'not_flushing', label: 'Not Flushing' },
        { id: 'seat', label: 'Seat Issue' },
    ],
    shower: [
        { id: 'clogged_drain', label: 'Clogged Drain' },
        { id: 'leaking', label: 'Leaking' },
        { id: 'low_pressure', label: 'Low Pressure' },
        { id: 'temperature', label: 'Temperature' },
        { id: 'tile', label: 'Tile Issue' },
    ],
    pipes: [
        { id: 'leaking', label: 'Leaking' },
        { id: 'burst', label: 'Burst' },
        { id: 'frozen', label: 'Frozen' },
        { id: 'noise', label: 'Noise' },
    ],
    faucets: [
        { id: 'leaking', label: 'Leaking' },
        { id: 'dripping', label: 'Dripping' },
        { id: 'low_pressure', label: 'Low Pressure' },
        { id: 'handle', label: 'Handle Issue' },
    ],
    drains: [
        { id: 'clogged', label: 'Clogged' },
        { id: 'slow', label: 'Slow Draining' },
        { id: 'smell', label: 'Bad Smell' },
        { id: 'backed_up', label: 'Backed Up' },
    ],
    // Fallback
    default: [
        { id: 'other', label: 'Other' },
    ]
};

const IssueDefinition: React.FC<IssueDefinitionProps> = ({ selectedIssue, onSelect, subCategory }) => {
    const items = issuesMap[subCategory] || issuesMap['default'];

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Define the problem</h2>
                <p className="text-gray-500">Please select the option below.</p>
            </div>

            <div className="bg-[#F0F0F6] p-10 rounded-[2rem] min-h-[300px] flex flex-wrap content-start gap-4">
                {items.map((item) => {
                    const isSelected = selectedIssue === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            className={`
                flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 font-medium
                ${isSelected
                                    ? 'bg-[#7BD747] text-white shadow-sm'
                                    : 'bg-[#7BD747] text-white opacity-80 hover:opacity-100'
                                }
              `}
                        >
                            <div className={`
                w-5 h-5 rounded-full border-2 border-white flex items-center justify-center
                ${isSelected ? 'bg-white' : 'bg-transparent'}
              `}>
                                {isSelected && <Check size={12} className="text-[#7BD747]" strokeWidth={4} />}
                            </div>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default IssueDefinition;
