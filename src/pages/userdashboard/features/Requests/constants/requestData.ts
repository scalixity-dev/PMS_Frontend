import { Monitor, Lightbulb, Home, Brush, TreePine, Droplets } from "lucide-react";

export const categories = [
    { id: "appliances", name: "Appliances", icon: Monitor },
    { id: "electrical", name: "Electrical", icon: Lightbulb },
    { id: "exterior", name: "Exterior", icon: Home },
    { id: "households", name: "Households", icon: Brush },
    { id: "outdoors", name: "Outdoors", icon: TreePine },
    { id: "plumbing", name: "Plumbing", icon: Droplets },
];

export const requestMapping: Record<string, {
    subCategories: string[],
    problems: Record<string, string[]>,
    details: Record<string, string[]>
}> = {
    appliances: {
        subCategories: ["Refrigerator", "Dishwasher", "Stove/Oven", "Microwave", "Washer/Dryer"],
        problems: {
            "Refrigerator": ["Not cooling", "Leaking water", "Making noise", "Ice maker broken"],
            "Dishwasher": ["Not draining", "Not cleaning properly", "Leaking", "Won't start"],
            "Stove/Oven": ["Burner not heating", "Oven not reaching temp", "Gas smell", "Control panel issue"],
            "Microwave": ["Not heating", "Turntable not spinning", "Sparking", "Button unresponsive"],
            "Washer/Dryer": ["Not spinning", "Leaking", "Not heating (dryer)", "Won't drain (washer)"],
        },
        details: {
            "Not cooling": ["Temperature too high", "Freezer working but fridge not", "Completely dead"],
            "Leaking water": ["Water on floor", "Ice build up", "Internal leak"],
            "Making noise": ["Vibrating", "Grinding sound", "Clicking"],
            "Not draining": ["Standing water at bottom", "Error code shown", "Pump hums but no drain"],
            "Burner not heating": ["Only one burner out", "All burners out", "Sparking but no flame"],
            "Not heating": ["Light comes on but no heat", "Smell of burning", "Loud buzzing"],
        }
    },
    electrical: {
        subCategories: ["Lights", "Outlets/Switches", "Breaker Panel", "Wiring"],
        problems: {
            "Lights": ["Flickering", "Not turning on", "Bulb replacement needed", "Buzzing sound"],
            "Outlets/Switches": ["Not working", "Sparking", "Loose outlet", "Hot to touch"],
            "Breaker Panel": ["Tripped breaker", "Burning smell", "Humming noise"],
            "Wiring": ["Exposed wires", "Rodent damage", "Static noise"],
        },
        details: {
            "Flickering": ["One room only", "Entire house", "When large appliance turns on"],
            "Not working": ["Reset button tripped", "No power at all", "Partial power"],
            "Tripped breaker": ["Won't stay reset", "Trips frequently", "Won't move to ON"],
        }
    },
    exterior: {
        subCategories: ["Roofing", "Gutters", "Siding", "Windows", "Doors"],
        problems: {
            "Roofing": ["Leak", "Missing shingles", "Sagging", "Moss/Debris"],
            "Gutters": ["Clogged", "Detached", "Leaking seams", "Overflowing"],
            "Siding": ["Loose panels", "Holes/Cracks", "Mold/Mildew"],
            "Windows": ["Broken glass", "Stuck", "Drafty", "Foggy between panes"],
            "Doors": ["Lock issue", "Squeaking", "Not closing/sealing", "Damaged"],
        },
        details: {
            "Leak": ["Water dripping from ceiling", "Wet spots in attic", "Visible daylight"],
            "Broken glass": ["Shattered", "Cracked", "Hole"],
            "Lock issue": ["Key won't turn", "Latch not catching", "Electronic lock fail"],
        }
    },
    households: {
        subCategories: ["Painting", "Flooring", "Drywall", "Cleaning"],
        problems: {
            "Painting": ["Peeling", "Scuffed", "Stained", "New paint request"],
            "Flooring": ["Scratched", "Loose tile/plank", "Carpet stain", "Water damage"],
            "Drywall": ["Hole", "Crack", "Water spots", "Peeling tape"],
            "Cleaning": ["Deep clean", "Move in/out clean", "Pest issue"],
        },
        details: {
            "Hole": ["Large (door knob size)", "Small (nail hole)", "Multiple holes"],
            "Water damage": ["Floor warping", "Soft spots", "Discoloration"],
        }
    },
    outdoors: {
        subCategories: ["Landscaping", "Fencing", "Pool", "Parking", "Patio/Deck"],
        problems: {
            "Landscaping": ["Overgrown", "Dead grass/plants", "Irrigation leak", "Tree trimming"],
            "Fencing": ["Broken slats", "Gate won't close", "Leaning fence"],
            "Pool": ["Dirty water", "Pump noise", "Filter needs change", "Heater issue"],
            "Parking": ["Potholes", "Unauthorized vehicle", "Oil stains", "Gate/Remote issue"],
            "Patio/Deck": ["Loose boards", "Splinters", "Railing loose", "Staining needed"],
        },
        details: {
            "Overgrown": ["Lawn only", "Bushes/Hedges", "Full yard"],
            "Dirty water": ["Green algae", "Cloudy", "Debris at bottom"],
        }
    },
    plumbing: {
        subCategories: ["Leaks", "Clogs", "Water Heater", "Toilet", "Sink/Faucet", "Shower/Tub"],
        problems: {
            "Leaks": ["Under sink", "Main line", "Ceiling leak", "Running toilet"],
            "Clogs": ["Kitchen sink", "Bathroom sink", "Toilet", "Shower drain"],
            "Water Heater": ["No hot water", "Not enough hot water", "Leaking tank", "Making noise"],
            "Toilet": ["Not flushing", "Overflowing", "Loose base", "Seat broken"],
            "Sink/Faucet": ["Low pressure", "Dripping faucet", "Sprayer broken"],
            "Shower/Tub": ["Clogged drain", "Leaky showerhead", "Low pressure", "Knob broken"],
        },
        details: {
            "Clogs": ["Multiple drains slow", "Total blockage", "Gurgling sounds"],
            "Clogged drain": ["Water standing in tub", "Slow to drain", "Hair/Debris visible"],
            "No hot water": ["Pilot light out", "Lukewarm water", "Water is cold"],
            "Running toilet": ["Constant running", "Intermittent refill", "Ghost flushing"],
        }
    }
};

export const propertiesList = [
    {
        id: '1',
        name: 'Main Street Apartment',
        address: '123 Main St, Apartment 4B, New York, NY 10001',
    },
    {
        id: '2',
        name: 'Sunset Villa',
        address: '456 Sunset Blvd, Los Angeles, CA 90028',
    }
];

