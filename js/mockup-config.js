// Complete Mockup Configuration with All 23 Audiences
// Two-Level Filtering: Audience → Location → Mockup
// Each mockup auto-detects its screen area dynamically from transparency.

const MOCKUP_CONFIG = {
    athleticMen: {
        id: 'athleticMen',
        name: 'Athletic Men',
        icon: '💪',
        description: 'Target fitness-focused male audience',
        locations: {
            gymFitness: {
                id: 'gymFitness',
                name: 'Gym/Fitness Center',
                mockups: [
                    { id: 'gym_men_portrait', name: 'Gym Ad - Portrait', image: 'mockup-images/athletic-men/gym-portrait.png', orientation: 'portrait', description: 'Vertical ad display in gym' },
                    { id: 'gym_men_landscape', name: 'Gym Ad - Landscape', image: 'mockup-images/athletic-men/gym-landscape.png', orientation: 'landscape', description: 'Horizontal ad display in gym' }
                ]
            },
            sportsStadium: {
                id: 'sportsStadium',
                name: 'Sports Stadium',
                mockups: [
                    { id: 'stadium_men_portrait', name: 'Stadium Ad - Portrait', image: 'mockup-images/athletic-men/stadium-portrait.png', orientation: 'portrait', description: 'Vertical LED board at stadium' },
                    { id: 'stadium_men_landscape', name: 'Stadium Ad - Landscape', image: 'mockup-images/athletic-men/stadium-landscape.png', orientation: 'landscape', description: 'Horizontal LED board at stadium' }
                ]
            },
            runningTrack: {
                id: 'runningTrack',
                name: 'Running Track',
                mockups: [
                    { id: 'track_men_portrait', name: 'Track Ad - Portrait', image: 'mockup-images/athletic-men/track-portrait.png', orientation: 'portrait', description: 'Vertical billboard at track' },
                    { id: 'track_men_landscape', name: 'Track Ad - Landscape', image: 'mockup-images/athletic-men/track-landscape.png', orientation: 'landscape', description: 'Horizontal billboard at track' }
                ]
            },
            sportsBar: {
                id: 'sportsBar',
                name: 'Sports Bar',
                mockups: [
                    { id: 'sportsbar_men_portrait', name: 'Sports Bar Ad - Portrait', image: 'mockup-images/athletic-men/sportsbar-portrait.png', orientation: 'portrait', description: 'Vertical poster in sports bar' },
                    { id: 'sportsbar_men_landscape', name: 'Sports Bar Ad - Landscape', image: 'mockup-images/athletic-men/sportsbar-landscape.png', orientation: 'landscape', description: 'Horizontal poster in sports bar' }
                ]
            },
            athleticStore: {
                id: 'athleticStore',
                name: 'Athletic Store',
                mockups: [
                    { id: 'athletic_store_portrait', name: 'Athletic Store - Portrait', image: 'mockup-images/athletic-men/athletic-store-portrait.png', orientation: 'portrait', description: 'Vertical display in athletic store' },
                    { id: 'athletic_store_landscape', name: 'Athletic Store - Landscape', image: 'mockup-images/athletic-men/athletic-store-landscape.png', orientation: 'landscape', description: 'Horizontal display in athletic store' }
                ]
            },
            supplementStore: {
                id: 'supplementStore',
                name: 'Supplement Store',
                mockups: [
                    { id: 'supplement_portrait', name: 'Supplement Store - Portrait', image: 'mockup-images/athletic-men/supplement-portrait.png', orientation: 'portrait', description: 'Vertical poster in supplement store' },
                    { id: 'supplement_landscape', name: 'Supplement Store - Landscape', image: 'mockup-images/athletic-men/supplement-landscape.png', orientation: 'landscape', description: 'Horizontal poster in supplement store' }
                ]
            },
            outdoorPark: {
                id: 'outdoorPark',
                name: 'Outdoor Park',
                mockups: [
                    { id: 'park_men_portrait', name: 'Park Ad - Portrait', image: 'mockup-images/athletic-men/park-portrait.png', orientation: 'portrait', description: 'Vertical sign at park' },
                    { id: 'park_men_landscape', name: 'Park Ad - Landscape', image: 'mockup-images/athletic-men/park-landscape.png', orientation: 'landscape', description: 'Horizontal sign at park' }
                ]
            },
            swimmingPool: {
                id: 'swimmingPool',
                name: 'Swimming Pool',
                mockups: [
                    { id: 'pool_men_portrait', name: 'Pool Ad - Portrait', image: 'mockup-images/athletic-men/pool-portrait.png', orientation: 'portrait', description: 'Vertical display at pool' },
                    { id: 'pool_men_landscape', name: 'Pool Ad - Landscape', image: 'mockup-images/athletic-men/pool-landscape.png', orientation: 'landscape', description: 'Horizontal display at pool' }
                ]
            },
            boxingGym: {
                id: 'boxingGym',
                name: 'Boxing Gym',
                mockups: [
                    { id: 'boxing_portrait', name: 'Boxing Gym - Portrait', image: 'mockup-images/athletic-men/boxing-portrait.png', orientation: 'portrait', description: 'Vertical poster in boxing gym' },
                    { id: 'boxing_landscape', name: 'Boxing Gym - Landscape', image: 'mockup-images/athletic-men/boxing-landscape.png', orientation: 'landscape', description: 'Horizontal poster in boxing gym' }
                ]
            }
        }
    },

    athleticWomen: {
        id: 'athleticWomen',
        name: 'Athletic Women',
        icon: '🏃‍♀️',
        description: 'Target fitness-focused female audience',
        locations: {
            gymFitness: {
                id: 'gymFitness',
                name: 'Gym/Fitness Center',
                mockups: [
                    { id: 'gym_women_portrait', name: 'Gym Ad - Portrait', image: 'mockup-images/athletic-women/gym-portrait.png', orientation: 'portrait', description: 'Vertical ad display in gym' },
                    { id: 'gym_women_landscape', name: 'Gym Ad - Landscape', image: 'mockup-images/athletic-women/gym-landscape.png', orientation: 'landscape', description: 'Horizontal ad display in gym' }
                ]
            },
            yogaStudio: {
                id: 'yogaStudio',
                name: 'Yoga Studio',
                mockups: [
                    { id: 'yoga_portrait', name: 'Yoga Studio - Portrait', image: 'mockup-images/athletic-women/yoga-portrait.png', orientation: 'portrait', description: 'Vertical poster in yoga studio' },
                    { id: 'yoga_landscape', name: 'Yoga Studio - Landscape', image: 'mockup-images/athletic-women/yoga-landscape.png', orientation: 'landscape', description: 'Horizontal poster in yoga studio' }
                ]
            },
            runningTrack: {
                id: 'runningTrack',
                name: 'Running Track',
                mockups: [
                    { id: 'track_women_portrait', name: 'Track Ad - Portrait', image: 'mockup-images/athletic-women/track-portrait.png', orientation: 'portrait', description: 'Vertical billboard at track' },
                    { id: 'track_women_landscape', name: 'Track Ad - Landscape', image: 'mockup-images/athletic-women/track-landscape.png', orientation: 'landscape', description: 'Horizontal billboard at track' }
                ]
            },
            sportsStadium: {
                id: 'sportsStadium',
                name: 'Sports Stadium',
                mockups: [
                    { id: 'stadium_women_portrait', name: 'Stadium Ad - Portrait', image: 'mockup-images/athletic-women/stadium-portrait.png', orientation: 'portrait', description: 'Vertical LED at stadium' },
                    { id: 'stadium_women_landscape', name: 'Stadium Ad - Landscape', image: 'mockup-images/athletic-women/stadium-landscape.png', orientation: 'landscape', description: 'Horizontal LED at stadium' }
                ]
            },
            athleticStore: {
                id: 'athleticStore',
                name: 'Athletic Store',
                mockups: [
                    { id: 'athletic_women_portrait', name: 'Athletic Store - Portrait', image: 'mockup-images/athletic-women/athletic-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'athletic_women_landscape', name: 'Athletic Store - Landscape', image: 'mockup-images/athletic-women/athletic-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            danceStudio: {
                id: 'danceStudio',
                name: 'Dance Studio',
                mockups: [
                    { id: 'dance_portrait', name: 'Dance Studio - Portrait', image: 'mockup-images/athletic-women/dance-portrait.png', orientation: 'portrait', description: 'Vertical poster in dance studio' },
                    { id: 'dance_landscape', name: 'Dance Studio - Landscape', image: 'mockup-images/athletic-women/dance-landscape.png', orientation: 'landscape', description: 'Horizontal poster in dance studio' }
                ]
            },
            pilatesStudio: {
                id: 'pilatesStudio',
                name: 'Pilates Studio',
                mockups: [
                    { id: 'pilates_portrait', name: 'Pilates Studio - Portrait', image: 'mockup-images/athletic-women/pilates-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'pilates_landscape', name: 'Pilates Studio - Landscape', image: 'mockup-images/athletic-women/pilates-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            healthFoodStore: {
                id: 'healthFoodStore',
                name: 'Health Food Store',
                mockups: [
                    { id: 'healthfood_women_portrait', name: 'Health Food - Portrait', image: 'mockup-images/athletic-women/healthfood-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'healthfood_women_landscape', name: 'Health Food - Landscape', image: 'mockup-images/athletic-women/healthfood-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            spaWellness: {
                id: 'spaWellness',
                name: 'Spa/Wellness Center',
                mockups: [
                    { id: 'spa_portrait', name: 'Spa - Portrait', image: 'mockup-images/athletic-women/spa-portrait.png', orientation: 'portrait', description: 'Vertical display at spa' },
                    { id: 'spa_landscape', name: 'Spa - Landscape', image: 'mockup-images/athletic-women/spa-landscape.png', orientation: 'landscape', description: 'Horizontal display at spa' }
                ]
            },
            parkTrail: {
                id: 'parkTrail',
                name: 'Park Trail',
                mockups: [
                    { id: 'trail_portrait', name: 'Trail - Portrait', image: 'mockup-images/athletic-women/trail-portrait.png', orientation: 'portrait', description: 'Vertical sign at trail' },
                    { id: 'trail_landscape', name: 'Trail - Landscape', image: 'mockup-images/athletic-women/trail-landscape.png', orientation: 'landscape', description: 'Horizontal sign at trail' }
                ]
            }
        }
    },

    housewives: {
        id: 'housewives',
        name: 'Housewives/Homemakers',
        icon: '🏡',
        description: 'Target homemaker audience',
        locations: {
            groceryStore: {
                id: 'groceryStore',
                name: 'Grocery Store',
                mockups: [
                    { id: 'grocery_portrait', name: 'Grocery Ad - Portrait', image: 'mockup-images/housewives/grocery-portrait.png', orientation: 'portrait', description: 'Vertical display in grocery store' },
                    { id: 'grocery_landscape', name: 'Grocery Ad - Landscape', image: 'mockup-images/housewives/grocery-landscape.png', orientation: 'landscape', description: 'Horizontal display in grocery store' }
                ]
            },
            supermarket: {
                id: 'supermarket',
                name: 'Supermarket',
                mockups: [
                    { id: 'supermarket_portrait', name: 'Supermarket - Portrait', image: 'mockup-images/housewives/supermarket-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'supermarket_landscape', name: 'Supermarket - Landscape', image: 'mockup-images/housewives/supermarket-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            departmentStore: {
                id: 'departmentStore',
                name: 'Department Store',
                mockups: [
                    { id: 'department_portrait', name: 'Department Store - Portrait', image: 'mockup-images/housewives/department-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'department_landscape', name: 'Department Store - Landscape', image: 'mockup-images/housewives/department-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            clothingStore: {
                id: 'clothingStore',
                name: 'Clothing Store',
                mockups: [
                    { id: 'clothing_portrait', name: 'Clothing Store - Portrait', image: 'mockup-images/housewives/clothing-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'clothing_landscape', name: 'Clothing Store - Landscape', image: 'mockup-images/housewives/clothing-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            homeGoodsStore: {
                id: 'homeGoodsStore',
                name: 'Home Goods Store',
                mockups: [
                    { id: 'homegoods_portrait', name: 'Home Goods - Portrait', image: 'mockup-images/housewives/homegoods-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'homegoods_landscape', name: 'Home Goods - Landscape', image: 'mockup-images/housewives/homegoods-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            beautySalon: {
                id: 'beautySalon',
                name: 'Beauty Salon',
                mockups: [
                    { id: 'salon_portrait', name: 'Beauty Salon - Portrait', image: 'mockup-images/housewives/salon-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'salon_landscape', name: 'Beauty Salon - Landscape', image: 'mockup-images/housewives/salon-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            bakery: {
                id: 'bakery',
                name: 'Bakery',
                mockups: [
                    { id: 'bakery_portrait', name: 'Bakery - Portrait', image: 'mockup-images/housewives/bakery-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'bakery_landscape', name: 'Bakery - Landscape', image: 'mockup-images/housewives/bakery-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            pharmacy: {
                id: 'pharmacy',
                name: 'Pharmacy',
                mockups: [
                    { id: 'pharmacy_portrait', name: 'Pharmacy - Portrait', image: 'mockup-images/housewives/pharmacy-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'pharmacy_landscape', name: 'Pharmacy - Landscape', image: 'mockup-images/housewives/pharmacy-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            farmersMarket: {
                id: 'farmersMarket',
                name: 'Farmers Market',
                mockups: [
                    { id: 'market_portrait', name: 'Farmers Market - Portrait', image: 'mockup-images/housewives/market-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'market_landscape', name: 'Farmers Market - Landscape', image: 'mockup-images/housewives/market-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            craftStore: {
                id: 'craftStore',
                name: 'Craft Store',
                mockups: [
                    { id: 'craft_portrait', name: 'Craft Store - Portrait', image: 'mockup-images/housewives/craft-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'craft_landscape', name: 'Craft Store - Landscape', image: 'mockup-images/housewives/craft-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            }
        }
    },

    workingProfessionals: {
        id: 'workingProfessionals',
        name: 'Working Professionals',
        icon: '💼',
        description: 'Target business professionals',
        locations: {
            airport: {
                id: 'airport',
                name: 'Airport',
                mockups: [
                    { id: 'airport_portrait', name: 'Airport - Portrait', image: 'mockup-images/outdoor/outdoor-airport.png', orientation: 'portrait', description: 'Vertical billboard in airport' },
                    { id: 'airport_landscape', name: 'Airport - Landscape', image: 'mockup-images/outdoor/airport-checkin-ad.png', orientation: 'landscape', description: 'Horizontal billboard in airport' }
                ]
            },
            trainStation: {
                id: 'trainStation',
                name: 'Train Station',
                mockups: [
                    { id: 'train_portrait', name: 'Train Station - Portrait', image: 'mockup-images/working-professionals/train-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'train_landscape', name: 'Train Station - Landscape', image: 'mockup-images/outdoor/tube-train-ads.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            officeBuilding: {
                id: 'officeBuilding',
                name: 'Office Building Lobby',
                mockups: [
                    { id: 'office_portrait', name: 'Office Lobby - Portrait', image: 'mockup-images/working-professionals/office-portrait.png', orientation: 'portrait', description: 'Vertical screen in lobby' },
                    { id: 'office_landscape', name: 'Office Lobby - Landscape', image: 'mockup-images/working-professionals/office-landscape.png', orientation: 'landscape', description: 'Horizontal screen in lobby' }
                ]
            },
            coffeeShop: {
                id: 'coffeeShop',
                name: 'Coffee Shop',
                mockups: [
                    { id: 'coffee_portrait', name: 'Coffee Shop - Portrait', image: 'mockup-images/working-professionals/coffee-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'coffee_landscape', name: 'Coffee Shop - Landscape', image: 'mockup-images/working-professionals/coffee-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            businessDistrict: {
                id: 'businessDistrict',
                name: 'Business District Street',
                mockups: [
                    { id: 'business_street_portrait', name: 'Business District - Portrait', image: 'mockup-images/working-professionals/business-portrait.png', orientation: 'portrait', description: 'Vertical billboard' },
                    { id: 'business_street_landscape', name: 'Business District - Landscape', image: 'mockup-images/working-professionals/business-landscape.png', orientation: 'landscape', description: 'Horizontal billboard' }
                ]
            },
            hotelLobby: {
                id: 'hotelLobby',
                name: 'Hotel Lobby',
                mockups: [
                    { id: 'hotel_portrait', name: 'Hotel Lobby - Portrait', image: 'mockup-images/working-professionals/hotel-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'hotel_landscape', name: 'Hotel Lobby - Landscape', image: 'mockup-images/working-professionals/hotel-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            conferenceCenter: {
                id: 'conferenceCenter',
                name: 'Conference Center',
                mockups: [
                    { id: 'conference_portrait', name: 'Conference - Portrait', image: 'mockup-images/working-professionals/conference-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'conference_landscape', name: 'Conference - Landscape', image: 'mockup-images/working-professionals/conference-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            parkingGarage: {
                id: 'parkingGarage',
                name: 'Parking Garage',
                mockups: [
                    { id: 'parking_portrait', name: 'Parking - Portrait', image: 'mockup-images/working-professionals/parking-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'parking_landscape', name: 'Parking - Landscape', image: 'mockup-images/working-professionals/parking-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            corporateCampus: {
                id: 'corporateCampus',
                name: 'Corporate Campus',
                mockups: [
                    { id: 'campus_portrait', name: 'Campus - Portrait', image: 'mockup-images/working-professionals/campus-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'campus_landscape', name: 'Campus - Landscape', image: 'mockup-images/working-professionals/campus-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            businessRestaurant: {
                id: 'businessRestaurant',
                name: 'Business Lunch Restaurant',
                mockups: [
                    { id: 'bizrestaurant_portrait', name: 'Restaurant - Portrait', image: 'mockup-images/working-professionals/restaurant-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'bizrestaurant_landscape', name: 'Restaurant - Landscape', image: 'mockup-images/working-professionals/restaurant-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            }
        }
    },

    children: {
        id: 'children',
        name: 'Children (6-12 years)',
        icon: '🎈',
        description: 'Target children audience',
        locations: {
            toyStore: {
                id: 'toyStore',
                name: 'Toy Store',
                mockups: [
                    { id: 'toy_portrait', name: 'Toy Store - Portrait', image: 'mockup-images/children/toy-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'toy_landscape', name: 'Toy Store - Landscape', image: 'mockup-images/children/toy-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            playground: {
                id: 'playground',
                name: 'Playground',
                mockups: [
                    { id: 'playground_portrait', name: 'Playground - Portrait', image: 'mockup-images/children/playground-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'playground_landscape', name: 'Playground - Landscape', image: 'mockup-images/children/playground-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            amusementPark: {
                id: 'amusementPark',
                name: 'Amusement Park',
                mockups: [
                    { id: 'amusement_portrait', name: 'Amusement Park - Portrait', image: 'mockup-images/children/amusement-portrait.png', orientation: 'portrait', description: 'Vertical billboard' },
                    { id: 'amusement_landscape', name: 'Amusement Park - Landscape', image: 'mockup-images/children/amusement-landscape.png', orientation: 'landscape', description: 'Horizontal billboard' }
                ]
            },
            iceCreamShop: {
                id: 'iceCreamShop',
                name: 'Ice Cream Shop',
                mockups: [
                    { id: 'icecream_portrait', name: 'Ice Cream Shop - Portrait', image: 'mockup-images/children/icecream-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'icecream_landscape', name: 'Ice Cream Shop - Landscape', image: 'mockup-images/children/icecream-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            schoolArea: {
                id: 'schoolArea',
                name: 'School Areas',
                mockups: [
                    { id: 'school_portrait', name: 'School - Portrait', image: 'mockup-images/children/school-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'school_landscape', name: 'School - Landscape', image: 'mockup-images/children/school-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            libraryKids: {
                id: 'libraryKids',
                name: "Library Children's Section",
                mockups: [
                    { id: 'library_kids_portrait', name: 'Library - Portrait', image: 'mockup-images/children/library-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'library_kids_landscape', name: 'Library - Landscape', image: 'mockup-images/children/library-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            movieTheater: {
                id: 'movieTheater',
                name: 'Movie Theater',
                mockups: [
                    { id: 'theater_kids_portrait', name: 'Theater - Portrait', image: 'mockup-images/children/theater-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'theater_kids_landscape', name: 'Theater - Landscape', image: 'mockup-images/children/theater-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            arcade: {
                id: 'arcade',
                name: 'Arcade',
                mockups: [
                    { id: 'arcade_kids_portrait', name: 'Arcade - Portrait', image: 'mockup-images/children/arcade-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'arcade_kids_landscape', name: 'Arcade - Landscape', image: 'mockup-images/children/arcade-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            pizzaRestaurant: {
                id: 'pizzaRestaurant',
                name: 'Pizza Restaurant',
                mockups: [
                    { id: 'pizza_portrait', name: 'Pizza Place - Portrait', image: 'mockup-images/children/pizza-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'pizza_landscape', name: 'Pizza Place - Landscape', image: 'mockup-images/children/pizza-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            sportsField: {
                id: 'sportsField',
                name: 'Sports Field',
                mockups: [
                    { id: 'sportsfield_portrait', name: 'Sports Field - Portrait', image: 'mockup-images/children/sportsfield-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'sportsfield_landscape', name: 'Sports Field - Landscape', image: 'mockup-images/children/sportsfield-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            }
        }
    },

    teenagers: {
        id: 'teenagers',
        name: 'Teenagers (13-18 years)',
        icon: '🎮',
        description: 'Target teenage audience',
        locations: {
            shoppingMall: {
                id: 'shoppingMall',
                name: 'Shopping Mall',
                mockups: [
                    { id: 'mall_teen_portrait', name: 'Mall - Portrait', image: 'mockup-images/outdoor/mall-digital.png', orientation: 'portrait', description: 'Vertical digital screen' },
                    { id: 'mall_teen_landscape', name: 'Mall - Landscape', image: 'mockup-images/teenagers/mall-landscape.png', orientation: 'landscape', description: 'Horizontal digital screen' }
                ]
            },
            fastFood: {
                id: 'fastFood',
                name: 'Fast Food Restaurant',
                mockups: [
                    { id: 'fastfood_portrait', name: 'Fast Food - Portrait', image: 'mockup-images/teenagers/fastfood-portrait.png', orientation: 'portrait', description: 'Vertical menu board' },
                    { id: 'fastfood_landscape', name: 'Fast Food - Landscape', image: 'mockup-images/teenagers/fastfood-landscape.png', orientation: 'landscape', description: 'Horizontal menu board' }
                ]
            },
            movieTheater: {
                id: 'movieTheater',
                name: 'Movie Theater',
                mockups: [
                    { id: 'theater_teen_portrait', name: 'Theater - Portrait', image: 'mockup-images/teenagers/theater-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'theater_teen_landscape', name: 'Theater - Landscape', image: 'mockup-images/teenagers/theater-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            arcade: {
                id: 'arcade',
                name: 'Arcade',
                mockups: [
                    { id: 'arcade_teen_portrait', name: 'Arcade - Portrait', image: 'mockup-images/teenagers/arcade-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'arcade_teen_landscape', name: 'Arcade - Landscape', image: 'mockup-images/teenagers/arcade-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            skateboardPark: {
                id: 'skateboardPark',
                name: 'Skateboard Park',
                mockups: [
                    { id: 'skate_portrait', name: 'Skate Park - Portrait', image: 'mockup-images/teenagers/skate-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'skate_landscape', name: 'Skate Park - Landscape', image: 'mockup-images/teenagers/skate-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            highSchool: {
                id: 'highSchool',
                name: 'High School Areas',
                mockups: [
                    { id: 'highschool_portrait', name: 'High School - Portrait', image: 'mockup-images/teenagers/highschool-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'highschool_landscape', name: 'High School - Landscape', image: 'mockup-images/teenagers/highschool-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            bubbleTeaShop: {
                id: 'bubbleTeaShop',
                name: 'Bubble Tea Shop',
                mockups: [
                    { id: 'bubbletea_portrait', name: 'Bubble Tea - Portrait', image: 'mockup-images/teenagers/bubbletea-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'bubbletea_landscape', name: 'Bubble Tea - Landscape', image: 'mockup-images/teenagers/bubbletea-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            clothingStore: {
                id: 'clothingStore',
                name: 'Clothing Store',
                mockups: [
                    { id: 'clothing_teen_portrait', name: 'Clothing - Portrait', image: 'mockup-images/teenagers/clothing-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'clothing_teen_landscape', name: 'Clothing - Landscape', image: 'mockup-images/teenagers/clothing-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            musicStore: {
                id: 'musicStore',
                name: 'Music Store',
                mockups: [
                    { id: 'music_portrait', name: 'Music Store - Portrait', image: 'mockup-images/teenagers/music-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'music_landscape', name: 'Music Store - Landscape', image: 'mockup-images/teenagers/music-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            concertVenue: {
                id: 'concertVenue',
                name: 'Concert Venue',
                mockups: [
                    { id: 'concert_portrait', name: 'Concert - Portrait', image: 'mockup-images/teenagers/concert-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'concert_landscape', name: 'Concert - Landscape', image: 'mockup-images/teenagers/concert-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            }
        }
    },

    collegeStudents: {
        id: 'collegeStudents',
        name: 'College Students',
        icon: '🎓',
        description: 'Target college/university students',
        locations: {
            universityCampus: {
                id: 'universityCampus',
                name: 'University Campus',
                mockups: [
                    { id: 'campus_student_portrait', name: 'Campus - Portrait', image: 'mockup-images/college/campus-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'campus_student_landscape', name: 'Campus - Landscape', image: 'mockup-images/college/campus-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            library: {
                id: 'library',
                name: 'Library',
                mockups: [
                    { id: 'library_college_portrait', name: 'Library - Portrait', image: 'mockup-images/college/library-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'library_college_landscape', name: 'Library - Landscape', image: 'mockup-images/college/library-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            studentUnion: {
                id: 'studentUnion',
                name: 'Student Union',
                mockups: [
                    { id: 'union_portrait', name: 'Student Union - Portrait', image: 'mockup-images/college/union-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'union_landscape', name: 'Student Union - Landscape', image: 'mockup-images/college/union-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            coffeeShop: {
                id: 'coffeeShop',
                name: 'Coffee Shop',
                mockups: [
                    { id: 'coffee_college_portrait', name: 'Coffee Shop - Portrait', image: 'mockup-images/college/coffee-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'coffee_college_landscape', name: 'Coffee Shop - Landscape', image: 'mockup-images/college/coffee-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            budgetRestaurant: {
                id: 'budgetRestaurant',
                name: 'Budget Restaurant',
                mockups: [
                    { id: 'budget_restaurant_portrait', name: 'Budget Restaurant - Portrait', image: 'mockup-images/college/budget-portrait.png', orientation: 'portrait', description: 'Vertical menu' },
                    { id: 'budget_restaurant_landscape', name: 'Budget Restaurant - Landscape', image: 'mockup-images/college/budget-landscape.png', orientation: 'landscape', description: 'Horizontal menu' }
                ]
            },
            bookstore: {
                id: 'bookstore',
                name: 'Bookstore',
                mockups: [
                    { id: 'bookstore_portrait', name: 'Bookstore - Portrait', image: 'mockup-images/college/bookstore-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'bookstore_landscape', name: 'Bookstore - Landscape', image: 'mockup-images/college/bookstore-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            laundromat: {
                id: 'laundromat',
                name: 'Laundromat',
                mockups: [
                    { id: 'laundry_portrait', name: 'Laundromat - Portrait', image: 'mockup-images/college/laundry-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'laundry_landscape', name: 'Laundromat - Landscape', image: 'mockup-images/college/laundry-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            busStop: {
                id: 'busStop',
                name: 'Bus Stop',
                mockups: [
                    { id: 'busstop_college_portrait', name: 'Bus Stop - Portrait', image: 'mockup-images/college/busstop-portrait.png', orientation: 'portrait', description: 'Vertical shelter ad' },
                    { id: 'busstop_college_landscape', name: 'Bus Stop - Landscape', image: 'mockup-images/college/busstop-landscape.png', orientation: 'landscape', description: 'Horizontal shelter ad' }
                ]
            },
            dormCommon: {
                id: 'dormCommon',
                name: 'Dorm Common Area',
                mockups: [
                    { id: 'dorm_portrait', name: 'Dorm - Portrait', image: 'mockup-images/college/dorm-portrait.png', orientation: 'portrait', description: 'Vertical bulletin board' },
                    { id: 'dorm_landscape', name: 'Dorm - Landscape', image: 'mockup-images/college/dorm-landscape.png', orientation: 'landscape', description: 'Horizontal bulletin board' }
                ]
            },
            fastCasual: {
                id: 'fastCasual',
                name: 'Fast Casual Dining',
                mockups: [
                    { id: 'fastcasual_portrait', name: 'Fast Casual - Portrait', image: 'mockup-images/college/fastcasual-portrait.png', orientation: 'portrait', description: 'Vertical menu board' },
                    { id: 'fastcasual_landscape', name: 'Fast Casual - Landscape', image: 'mockup-images/college/fastcasual-landscape.png', orientation: 'landscape', description: 'Horizontal menu board' }
                ]
            }
        }
    },

    travelers: {
        id: 'travelers',
        name: 'Travelers/Tourists',
        icon: '✈️',
        description: 'Target travelers and tourists',
        locations: {
            airport: {
                id: 'airport',
                name: 'Airport',
                mockups: [
                    { id: 'airport_traveler_portrait', name: 'Airport - Portrait', image: 'mockup-images/outdoor/airport-checkin-ad.png', orientation: 'portrait', description: 'Vertical billboard' },
                    { id: 'airport_traveler_landscape', name: 'Airport - Landscape', image: 'mockup-images/outdoor/outdoor-airport.png', orientation: 'landscape', description: 'Horizontal billboard' }
                ]
            },
            trainStation: {
                id: 'trainStation',
                name: 'Train Station',
                mockups: [
                    { id: 'train_traveler_portrait', name: 'Train Station - Portrait', image: 'mockup-images/travelers/train-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'train_traveler_landscape', name: 'Train Station - Landscape', image: 'mockup-images/travelers/train-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            busTerminal: {
                id: 'busTerminal',
                name: 'Bus Terminal',
                mockups: [
                    { id: 'busterminal_portrait', name: 'Bus Terminal - Portrait', image: 'mockup-images/travelers/busterminal-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'busterminal_landscape', name: 'Bus Terminal - Landscape', image: 'mockup-images/travelers/busterminal-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            hotelLobby: {
                id: 'hotelLobby',
                name: 'Hotel Lobby',
                mockups: [
                    { id: 'hotel_traveler_portrait', name: 'Hotel Lobby - Portrait', image: 'mockup-images/travelers/hotel-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'hotel_traveler_landscape', name: 'Hotel Lobby - Landscape', image: 'mockup-images/travelers/hotel-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            touristInfo: {
                id: 'touristInfo',
                name: 'Tourist Information Center',
                mockups: [
                    { id: 'touristinfo_portrait', name: 'Tourist Info - Portrait', image: 'mockup-images/travelers/touristinfo-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'touristinfo_landscape', name: 'Tourist Info - Landscape', image: 'mockup-images/travelers/touristinfo-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            rentalCar: {
                id: 'rentalCar',
                name: 'Rental Car Agency',
                mockups: [
                    { id: 'rentalcar_portrait', name: 'Rental Car - Portrait', image: 'mockup-images/travelers/rentalcar-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'rentalcar_landscape', name: 'Rental Car - Landscape', image: 'mockup-images/travelers/rentalcar-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            highwayRest: {
                id: 'highwayRest',
                name: 'Highway Rest Stop',
                mockups: [
                    { id: 'rest_portrait', name: 'Rest Stop - Portrait', image: 'mockup-images/travelers/rest-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'rest_landscape', name: 'Rest Stop - Landscape', image: 'mockup-images/travelers/rest-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            cruiseTerminal: {
                id: 'cruiseTerminal',
                name: 'Cruise Terminal',
                mockups: [
                    { id: 'cruise_portrait', name: 'Cruise Terminal - Portrait', image: 'mockup-images/travelers/cruise-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'cruise_landscape', name: 'Cruise Terminal - Landscape', image: 'mockup-images/travelers/cruise-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            touristAttractions: {
                id: 'touristAttractions',
                name: 'Tourist Attractions',
                mockups: [
                    { id: 'attraction_portrait', name: 'Attraction - Portrait', image: 'mockup-images/travelers/attraction-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'attraction_landscape', name: 'Attraction - Landscape', image: 'mockup-images/travelers/attraction-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            souvenirShop: {
                id: 'souvenirShop',
                name: 'Souvenir Shop',
                mockups: [
                    { id: 'souvenir_portrait', name: 'Souvenir Shop - Portrait', image: 'mockup-images/travelers/souvenir-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'souvenir_landscape', name: 'Souvenir Shop - Landscape', image: 'mockup-images/travelers/souvenir-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            }
        }
    },

    commuters: {
        id: 'commuters',
        name: 'Commuters',
        icon: '🚇',
        description: 'Target daily commuters',
        locations: {
            subwayMetro: {
                id: 'subwayMetro',
                name: 'Subway/Metro Station',
                mockups: [
                    { id: 'metro_portrait', name: 'Metro - Portrait', image: 'mockup-images/commuters/metro-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'metro_landscape', name: 'Metro - Landscape', image: 'mockup-images/outdoor/tube-train-ads.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            busStop: {
                id: 'busStop',
                name: 'Bus Stop',
                mockups: [
                    { id: 'busstop_portrait', name: 'Bus Stop - Portrait', image: 'mockup-images/outdoor/bus-shelter.png', orientation: 'portrait', description: 'Vertical shelter ad' },
                    { id: 'busstop_landscape', name: 'Bus Stop - Landscape', image: 'mockup-images/commuters/busstop-landscape.png', orientation: 'landscape', description: 'Horizontal shelter ad' }
                ]
            },
            trainPlatform: {
                id: 'trainPlatform',
                name: 'Train Platform',
                mockups: [
                    { id: 'platform_portrait', name: 'Platform - Portrait', image: 'mockup-images/commuters/platform-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'platform_landscape', name: 'Platform - Landscape', image: 'mockup-images/commuters/platform-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            highwayBillboard: {
                id: 'highwayBillboard',
                name: 'Highway Billboard',
                mockups: [
                    { id: 'highway_portrait', name: 'Highway - Portrait', image: 'mockup-images/outdoor/highway-billboard.png', orientation: 'portrait', description: 'Vertical billboard' },
                    { id: 'highway_landscape', name: 'Highway - Landscape', image: 'mockup-images/commuters/highway-landscape.png', orientation: 'landscape', description: 'Horizontal billboard' }
                ]
            },
            parkingGarage: {
                id: 'parkingGarage',
                name: 'Parking Garage',
                mockups: [
                    { id: 'parking_commuter_portrait', name: 'Parking - Portrait', image: 'mockup-images/commuters/parking-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'parking_commuter_landscape', name: 'Parking - Landscape', image: 'mockup-images/commuters/parking-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            gasStation: {
                id: 'gasStation',
                name: 'Gas Station',
                mockups: [
                    { id: 'gas_portrait', name: 'Gas Station - Portrait', image: 'mockup-images/commuters/gas-portrait.png', orientation: 'portrait', description: 'Vertical pump ad' },
                    { id: 'gas_landscape', name: 'Gas Station - Landscape', image: 'mockup-images/commuters/gas-landscape.png', orientation: 'landscape', description: 'Horizontal pump ad' }
                ]
            },
            carWash: {
                id: 'carWash',
                name: 'Car Wash',
                mockups: [
                    { id: 'carwash_portrait', name: 'Car Wash - Portrait', image: 'mockup-images/commuters/carwash-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'carwash_landscape', name: 'Car Wash - Landscape', image: 'mockup-images/commuters/carwash-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            trafficIntersection: {
                id: 'trafficIntersection',
                name: 'Traffic Intersection',
                mockups: [
                    { id: 'intersection_portrait', name: 'Intersection - Portrait', image: 'mockup-images/commuters/intersection-portrait.png', orientation: 'portrait', description: 'Vertical billboard' },
                    { id: 'intersection_landscape', name: 'Intersection - Landscape', image: 'mockup-images/commuters/intersection-landscape.png', orientation: 'landscape', description: 'Horizontal billboard' }
                ]
            },
            ridesharePickup: {
                id: 'ridesharePickup',
                name: 'Rideshare Pickup Zone',
                mockups: [
                    { id: 'rideshare_portrait', name: 'Rideshare - Portrait', image: 'mockup-images/commuters/rideshare-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'rideshare_landscape', name: 'Rideshare - Landscape', image: 'mockup-images/commuters/rideshare-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            }
        }
    },

    seniors: {
        id: 'seniors',
        name: 'Seniors (65+ years)',
        icon: '👴',
        description: 'Target senior citizen audience',
        locations: {
            pharmacy: {
                id: 'pharmacy',
                name: 'Pharmacy',
                mockups: [
                    { id: 'pharmacy_senior_portrait', name: 'Pharmacy - Portrait', image: 'mockup-images/seniors/pharmacy-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'pharmacy_senior_landscape', name: 'Pharmacy - Landscape', image: 'mockup-images/seniors/pharmacy-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            medicalCenter: {
                id: 'medicalCenter',
                name: 'Medical Center',
                mockups: [
                    { id: 'medical_portrait', name: 'Medical Center - Portrait', image: 'mockup-images/seniors/medical-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'medical_landscape', name: 'Medical Center - Landscape', image: 'mockup-images/seniors/medical-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            communityCenter: {
                id: 'communityCenter',
                name: 'Community Center',
                mockups: [
                    { id: 'community_portrait', name: 'Community Center - Portrait', image: 'mockup-images/seniors/community-portrait.png', orientation: 'portrait', description: 'Vertical bulletin' },
                    { id: 'community_landscape', name: 'Community Center - Landscape', image: 'mockup-images/seniors/community-landscape.png', orientation: 'landscape', description: 'Horizontal bulletin' }
                ]
            },
            library: {
                id: 'library',
                name: 'Library',
                mockups: [
                    { id: 'library_senior_portrait', name: 'Library - Portrait', image: 'mockup-images/seniors/library-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'library_senior_landscape', name: 'Library - Landscape', image: 'mockup-images/seniors/library-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            parkBench: {
                id: 'parkBench',
                name: 'Park Bench',
                mockups: [
                    { id: 'parkbench_portrait', name: 'Park Bench - Portrait', image: 'mockup-images/seniors/parkbench-portrait.png', orientation: 'portrait', description: 'Vertical bench ad' },
                    { id: 'parkbench_landscape', name: 'Park Bench - Landscape', image: 'mockup-images/seniors/parkbench-landscape.png', orientation: 'landscape', description: 'Horizontal bench ad' }
                ]
            },
            groceryStore: {
                id: 'groceryStore',
                name: 'Grocery Store',
                mockups: [
                    { id: 'grocery_senior_portrait', name: 'Grocery - Portrait', image: 'mockup-images/outdoor/outdoor-grocery-ad.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'grocery_senior_landscape', name: 'Grocery - Landscape', image: 'mockup-images/seniors/grocery-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            bank: {
                id: 'bank',
                name: 'Bank',
                mockups: [
                    { id: 'bank_portrait', name: 'Bank - Portrait', image: 'mockup-images/seniors/bank-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'bank_landscape', name: 'Bank - Landscape', image: 'mockup-images/seniors/bank-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            postOffice: {
                id: 'postOffice',
                name: 'Post Office',
                mockups: [
                    { id: 'post_portrait', name: 'Post Office - Portrait', image: 'mockup-images/seniors/post-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'post_landscape', name: 'Post Office - Landscape', image: 'mockup-images/seniors/post-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            gardenCenter: {
                id: 'gardenCenter',
                name: 'Garden Center',
                mockups: [
                    { id: 'garden_portrait', name: 'Garden Center - Portrait', image: 'mockup-images/seniors/garden-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'garden_landscape', name: 'Garden Center - Landscape', image: 'mockup-images/seniors/garden-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            restaurantEarly: {
                id: 'restaurantEarly',
                name: 'Restaurant (Early Hours)',
                mockups: [
                    { id: 'restaurant_early_portrait', name: 'Restaurant - Portrait', image: 'mockup-images/seniors/restaurant-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'restaurant_early_landscape', name: 'Restaurant - Landscape', image: 'mockup-images/seniors/restaurant-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            }
        }
    },

    parentsYoungKids: {
        id: 'parentsYoungKids',
        name: 'Parents with Young Kids',
        icon: '👨‍👩‍👧‍👦',
        description: 'Target parents with young children',
        locations: {
            pediatricClinic: {
                id: 'pediatricClinic',
                name: 'Pediatric Clinic',
                mockups: [
                    { id: 'pediatric_portrait', name: 'Pediatric Clinic - Portrait', image: 'mockup-images/parents/pediatric-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'pediatric_landscape', name: 'Pediatric Clinic - Landscape', image: 'mockup-images/parents/pediatric-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            daycarePickup: {
                id: 'daycarePickup',
                name: 'Daycare Pickup Area',
                mockups: [
                    { id: 'daycare_portrait', name: 'Daycare - Portrait', image: 'mockup-images/parents/daycare-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'daycare_landscape', name: 'Daycare - Landscape', image: 'mockup-images/parents/daycare-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            childrensMuseum: {
                id: 'childrensMuseum',
                name: "Children's Museum",
                mockups: [
                    { id: 'museum_portrait', name: 'Museum - Portrait', image: 'mockup-images/parents/museum-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'museum_landscape', name: 'Museum - Landscape', image: 'mockup-images/parents/museum-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            familyRestaurant: {
                id: 'familyRestaurant',
                name: 'Family Restaurant',
                mockups: [
                    { id: 'family_restaurant_portrait', name: 'Family Restaurant - Portrait', image: 'mockup-images/parents/restaurant-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'family_restaurant_landscape', name: 'Family Restaurant - Landscape', image: 'mockup-images/parents/restaurant-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            playgroundPark: {
                id: 'playgroundPark',
                name: 'Playground/Park',
                mockups: [
                    { id: 'playground_parents_portrait', name: 'Playground - Portrait', image: 'mockup-images/parents/playground-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'playground_parents_landscape', name: 'Playground - Landscape', image: 'mockup-images/parents/playground-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            groceryStore: {
                id: 'groceryStore',
                name: 'Grocery Store',
                mockups: [
                    { id: 'grocery_parents_portrait', name: 'Grocery - Portrait', image: 'mockup-images/outdoor/instore-ad-veg.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'grocery_parents_landscape', name: 'Grocery - Landscape', image: 'mockup-images/parents/grocery-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            toyStore: {
                id: 'toyStore',
                name: 'Toy Store',
                mockups: [
                    { id: 'toy_parents_portrait', name: 'Toy Store - Portrait', image: 'mockup-images/parents/toy-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'toy_parents_landscape', name: 'Toy Store - Landscape', image: 'mockup-images/parents/toy-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            babyStore: {
                id: 'babyStore',
                name: 'Baby Store',
                mockups: [
                    { id: 'baby_portrait', name: 'Baby Store - Portrait', image: 'mockup-images/parents/baby-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'baby_landscape', name: 'Baby Store - Landscape', image: 'mockup-images/parents/baby-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            library: {
                id: 'library',
                name: 'Library',
                mockups: [
                    { id: 'library_parents_portrait', name: 'Library - Portrait', image: 'mockup-images/parents/library-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'library_parents_landscape', name: 'Library - Landscape', image: 'mockup-images/parents/library-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            swimmingPool: {
                id: 'swimmingPool',
                name: 'Swimming Pool',
                mockups: [
                    { id: 'pool_parents_portrait', name: 'Pool - Portrait', image: 'mockup-images/parents/pool-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'pool_parents_landscape', name: 'Pool - Landscape', image: 'mockup-images/parents/pool-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            }
        }
    },

    foodEnthusiasts: {
        id: 'foodEnthusiasts',
        name: 'Food Enthusiasts',
        icon: '🍽️',
        description: 'Target food lovers and culinary fans',
        locations: {
            restaurant: {
                id: 'restaurant',
                name: 'Restaurant',
                mockups: [
                    { id: 'restaurant_food_portrait', name: 'Restaurant - Portrait', image: 'mockup-images/food/restaurant-portrait.png', orientation: 'portrait', description: 'Vertical menu board' },
                    { id: 'restaurant_food_landscape', name: 'Restaurant - Landscape', image: 'mockup-images/food/restaurant-landscape.png', orientation: 'landscape', description: 'Horizontal menu board' }
                ]
            },
            foodCourt: {
                id: 'foodCourt',
                name: 'Food Court',
                mockups: [
                    { id: 'foodcourt_portrait', name: 'Food Court - Portrait', image: 'mockup-images/food/foodcourt-portrait.png', orientation: 'portrait', description: 'Vertical digital menu' },
                    { id: 'foodcourt_landscape', name: 'Food Court - Landscape', image: 'mockup-images/food/foodcourt-landscape.png', orientation: 'landscape', description: 'Horizontal digital menu' }
                ]
            },
            farmersMarket: {
                id: 'farmersMarket',
                name: 'Farmers Market',
                mockups: [
                    { id: 'market_food_portrait', name: 'Farmers Market - Portrait', image: 'mockup-images/food/market-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'market_food_landscape', name: 'Farmers Market - Landscape', image: 'mockup-images/food/market-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            gourmetStore: {
                id: 'gourmetStore',
                name: 'Gourmet Store',
                mockups: [
                    { id: 'gourmet_portrait', name: 'Gourmet Store - Portrait', image: 'mockup-images/food/gourmet-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'gourmet_landscape', name: 'Gourmet Store - Landscape', image: 'mockup-images/food/gourmet-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            cookingStore: {
                id: 'cookingStore',
                name: 'Cooking Store',
                mockups: [
                    { id: 'cooking_portrait', name: 'Cooking Store - Portrait', image: 'mockup-images/food/cooking-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'cooking_landscape', name: 'Cooking Store - Landscape', image: 'mockup-images/food/cooking-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            wineShop: {
                id: 'wineShop',
                name: 'Wine Shop',
                mockups: [
                    { id: 'wine_portrait', name: 'Wine Shop - Portrait', image: 'mockup-images/food/wine-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'wine_landscape', name: 'Wine Shop - Landscape', image: 'mockup-images/food/wine-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            bakery: {
                id: 'bakery',
                name: 'Bakery',
                mockups: [
                    { id: 'bakery_food_portrait', name: 'Bakery - Portrait', image: 'mockup-images/food/bakery-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'bakery_food_landscape', name: 'Bakery - Landscape', image: 'mockup-images/food/bakery-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            coffeeRoaster: {
                id: 'coffeeRoaster',
                name: 'Coffee Roaster',
                mockups: [
                    { id: 'roaster_portrait', name: 'Coffee Roaster - Portrait', image: 'mockup-images/food/roaster-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'roaster_landscape', name: 'Coffee Roaster - Landscape', image: 'mockup-images/food/roaster-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            foodFestival: {
                id: 'foodFestival',
                name: 'Food Festival',
                mockups: [
                    { id: 'festival_portrait', name: 'Food Festival - Portrait', image: 'mockup-images/food/festival-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'festival_landscape', name: 'Food Festival - Landscape', image: 'mockup-images/food/festival-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            culinarySchool: {
                id: 'culinarySchool',
                name: 'Culinary School',
                mockups: [
                    { id: 'culinary_portrait', name: 'Culinary School - Portrait', image: 'mockup-images/food/culinary-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'culinary_landscape', name: 'Culinary School - Landscape', image: 'mockup-images/food/culinary-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            }
        }
    },

    fashionShoppers: {
        id: 'fashionShoppers',
        name: 'Fashion Shoppers',
        icon: '👗',
        description: 'Target fashion-conscious shoppers',
        locations: {
            clothingStore: {
                id: 'clothingStore',
                name: 'Clothing Store',
                mockups: [
                    { id: 'clothing_fashion_portrait', name: 'Clothing Store - Portrait', image: 'mockup-images/fashion/clothing-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'clothing_fashion_landscape', name: 'Clothing Store - Landscape', image: 'mockup-images/fashion/clothing-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            fashionBoutique: {
                id: 'fashionBoutique',
                name: 'Fashion Boutique',
                mockups: [
                    { id: 'boutique_portrait', name: 'Boutique - Portrait', image: 'mockup-images/fashion/boutique-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'boutique_landscape', name: 'Boutique - Landscape', image: 'mockup-images/fashion/boutique-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            shoppingMall: {
                id: 'shoppingMall',
                name: 'Shopping Mall',
                mockups: [
                    { id: 'mall_fashion_portrait', name: 'Mall - Portrait', image: 'mockup-images/fashion/mall-portrait.png', orientation: 'portrait', description: 'Vertical digital screen' },
                    { id: 'mall_fashion_landscape', name: 'Mall - Landscape', image: 'mockup-images/fashion/mall-landscape.png', orientation: 'landscape', description: 'Horizontal digital screen' }
                ]
            },
            departmentStore: {
                id: 'departmentStore',
                name: 'Department Store',
                mockups: [
                    { id: 'department_fashion_portrait', name: 'Department Store - Portrait', image: 'mockup-images/fashion/department-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'department_fashion_landscape', name: 'Department Store - Landscape', image: 'mockup-images/fashion/department-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            shoeStore: {
                id: 'shoeStore',
                name: 'Shoe Store',
                mockups: [
                    { id: 'shoe_portrait', name: 'Shoe Store - Portrait', image: 'mockup-images/fashion/shoe-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'shoe_landscape', name: 'Shoe Store - Landscape', image: 'mockup-images/fashion/shoe-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            beautyStore: {
                id: 'beautyStore',
                name: 'Beauty Store',
                mockups: [
                    { id: 'beauty_portrait', name: 'Beauty Store - Portrait', image: 'mockup-images/fashion/beauty-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'beauty_landscape', name: 'Beauty Store - Landscape', image: 'mockup-images/fashion/beauty-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            accessoryShop: {
                id: 'accessoryShop',
                name: 'Accessory Shop',
                mockups: [
                    { id: 'accessory_portrait', name: 'Accessory Shop - Portrait', image: 'mockup-images/fashion/accessory-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'accessory_landscape', name: 'Accessory Shop - Landscape', image: 'mockup-images/fashion/accessory-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            designerOutlet: {
                id: 'designerOutlet',
                name: 'Designer Outlet',
                mockups: [
                    { id: 'outlet_portrait', name: 'Designer Outlet - Portrait', image: 'mockup-images/fashion/outlet-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'outlet_landscape', name: 'Designer Outlet - Landscape', image: 'mockup-images/fashion/outlet-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            fashionDistrict: {
                id: 'fashionDistrict',
                name: 'Fashion District Street',
                mockups: [
                    { id: 'fashion_street_portrait', name: 'Fashion District - Portrait', image: 'mockup-images/outdoor/street-kiosk.png', orientation: 'portrait', description: 'Vertical kiosk' },
                    { id: 'fashion_street_landscape', name: 'Fashion District - Landscape', image: 'mockup-images/fashion/street-landscape.png', orientation: 'landscape', description: 'Horizontal billboard' }
                ]
            }
        }
    },

    techEnthusiasts: {
        id: 'techEnthusiasts',
        name: 'Tech Enthusiasts',
        icon: '💻',
        description: 'Target technology fans',
        locations: {
            electronicsStore: {
                id: 'electronicsStore',
                name: 'Electronics Store',
                mockups: [
                    { id: 'electronics_portrait', name: 'Electronics Store - Portrait', image: 'mockup-images/tech/electronics-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'electronics_landscape', name: 'Electronics Store - Landscape', image: 'mockup-images/tech/electronics-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            techConference: {
                id: 'techConference',
                name: 'Tech Conference',
                mockups: [
                    { id: 'conference_tech_portrait', name: 'Tech Conference - Portrait', image: 'mockup-images/tech/conference-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'conference_tech_landscape', name: 'Tech Conference - Landscape', image: 'mockup-images/tech/conference-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            startupHub: {
                id: 'startupHub',
                name: 'Startup Hub',
                mockups: [
                    { id: 'startup_portrait', name: 'Startup Hub - Portrait', image: 'mockup-images/tech/startup-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'startup_landscape', name: 'Startup Hub - Landscape', image: 'mockup-images/tech/startup-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            computerStore: {
                id: 'computerStore',
                name: 'Computer Store',
                mockups: [
                    { id: 'computer_portrait', name: 'Computer Store - Portrait', image: 'mockup-images/tech/computer-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'computer_landscape', name: 'Computer Store - Landscape', image: 'mockup-images/tech/computer-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            gamingLounge: {
                id: 'gamingLounge',
                name: 'Gaming Lounge',
                mockups: [
                    { id: 'lounge_portrait', name: 'Gaming Lounge - Portrait', image: 'mockup-images/tech/lounge-portrait.png', orientation: 'portrait', description: 'Vertical LED' },
                    { id: 'lounge_landscape', name: 'Gaming Lounge - Landscape', image: 'mockup-images/tech/lounge-landscape.png', orientation: 'landscape', description: 'Horizontal LED' }
                ]
            },
            bookstoreTech: {
                id: 'bookstoreTech',
                name: 'Bookstore Tech Section',
                mockups: [
                    { id: 'booktech_portrait', name: 'Tech Books - Portrait', image: 'mockup-images/tech/booktech-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'booktech_landscape', name: 'Tech Books - Landscape', image: 'mockup-images/tech/booktech-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            techCoffee: {
                id: 'techCoffee',
                name: 'Coffee Shop (Tech District)',
                mockups: [
                    { id: 'techcoffee_portrait', name: 'Tech Coffee - Portrait', image: 'mockup-images/tech/techcoffee-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'techcoffee_landscape', name: 'Tech Coffee - Landscape', image: 'mockup-images/tech/techcoffee-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            engineering: {
                id: 'engineering',
                name: 'University Engineering Building',
                mockups: [
                    { id: 'engineering_portrait', name: 'Engineering - Portrait', image: 'mockup-images/tech/engineering-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'engineering_landscape', name: 'Engineering - Landscape', image: 'mockup-images/tech/engineering-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            }
        }
    },

    healthConscious: {
        id: 'healthConscious',
        name: 'Health Conscious',
        icon: '🥗',
        description: 'Target health-focused individuals',
        locations: {
            healthFoodStore: {
                id: 'healthFoodStore',
                name: 'Health Food Store',
                mockups: [
                    { id: 'healthfood_portrait', name: 'Health Food - Portrait', image: 'mockup-images/health/healthfood-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'healthfood_landscape', name: 'Health Food - Landscape', image: 'mockup-images/health/healthfood-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            organicMarket: {
                id: 'organicMarket',
                name: 'Organic Market',
                mockups: [
                    { id: 'organic_portrait', name: 'Organic Market - Portrait', image: 'mockup-images/health/organic-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'organic_landscape', name: 'Organic Market - Landscape', image: 'mockup-images/health/organic-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            juiceBar: {
                id: 'juiceBar',
                name: 'Juice Bar',
                mockups: [
                    { id: 'juice_portrait', name: 'Juice Bar - Portrait', image: 'mockup-images/health/juice-portrait.png', orientation: 'portrait', description: 'Vertical menu' },
                    { id: 'juice_landscape', name: 'Juice Bar - Landscape', image: 'mockup-images/health/juice-landscape.png', orientation: 'landscape', description: 'Horizontal menu' }
                ]
            },
            vitaminShop: {
                id: 'vitaminShop',
                name: 'Vitamin Shop',
                mockups: [
                    { id: 'vitamin_portrait', name: 'Vitamin Shop - Portrait', image: 'mockup-images/health/vitamin-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'vitamin_landscape', name: 'Vitamin Shop - Landscape', image: 'mockup-images/health/vitamin-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            yogaStudio: {
                id: 'yogaStudio',
                name: 'Yoga Studio',
                mockups: [
                    { id: 'yoga_health_portrait', name: 'Yoga Studio - Portrait', image: 'mockup-images/health/yoga-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'yoga_health_landscape', name: 'Yoga Studio - Landscape', image: 'mockup-images/health/yoga-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            farmersMarket: {
                id: 'farmersMarket',
                name: 'Farmers Market',
                mockups: [
                    { id: 'market_health_portrait', name: 'Farmers Market - Portrait', image: 'mockup-images/health/market-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'market_health_landscape', name: 'Farmers Market - Landscape', image: 'mockup-images/health/market-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            wellnessCenter: {
                id: 'wellnessCenter',
                name: 'Wellness Center',
                mockups: [
                    { id: 'wellness_portrait', name: 'Wellness Center - Portrait', image: 'mockup-images/health/wellness-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'wellness_landscape', name: 'Wellness Center - Landscape', image: 'mockup-images/health/wellness-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            spa: {
                id: 'spa',
                name: 'Spa',
                mockups: [
                    { id: 'spa_health_portrait', name: 'Spa - Portrait', image: 'mockup-images/health/spa-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'spa_health_landscape', name: 'Spa - Landscape', image: 'mockup-images/health/spa-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            runningTrail: {
                id: 'runningTrail',
                name: 'Running Trail',
                mockups: [
                    { id: 'trail_health_portrait', name: 'Running Trail - Portrait', image: 'mockup-images/health/trail-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'trail_health_landscape', name: 'Running Trail - Landscape', image: 'mockup-images/health/trail-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            meditationCenter: {
                id: 'meditationCenter',
                name: 'Meditation Center',
                mockups: [
                    { id: 'meditation_portrait', name: 'Meditation Center - Portrait', image: 'mockup-images/health/meditation-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'meditation_landscape', name: 'Meditation Center - Landscape', image: 'mockup-images/health/meditation-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            }
        }
    },

    sportsFans: {
        id: 'sportsFans',
        name: 'Sports Fans',
        icon: '⚽',
        description: 'Target sports enthusiasts',
        locations: {
            sportsStadium: {
                id: 'sportsStadium',
                name: 'Sports Stadium',
                mockups: [
                    { id: 'stadium_fans_portrait', name: 'Stadium - Portrait', image: 'mockup-images/outdoor/wembley-stadium-ad.png', orientation: 'portrait', description: 'Vertical LED' },
                    { id: 'stadium_fans_landscape', name: 'Stadium - Landscape', image: 'mockup-images/sports/stadium-landscape.png', orientation: 'landscape', description: 'Horizontal LED' }
                ]
            },
            sportsBar: {
                id: 'sportsBar',
                name: 'Sports Bar',
                mockups: [
                    { id: 'bar_fans_portrait', name: 'Sports Bar - Portrait', image: 'mockup-images/sports/bar-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'bar_fans_landscape', name: 'Sports Bar - Landscape', image: 'mockup-images/sports/bar-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            arena: {
                id: 'arena',
                name: 'Arena',
                mockups: [
                    { id: 'arena_portrait', name: 'Arena - Portrait', image: 'mockup-images/sports/arena-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'arena_landscape', name: 'Arena - Landscape', image: 'mockup-images/sports/arena-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            tailgateArea: {
                id: 'tailgateArea',
                name: 'Tailgate Area',
                mockups: [
                    { id: 'tailgate_portrait', name: 'Tailgate - Portrait', image: 'mockup-images/sports/tailgate-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'tailgate_landscape', name: 'Tailgate - Landscape', image: 'mockup-images/sports/tailgate-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            sportsMerch: {
                id: 'sportsMerch',
                name: 'Sports Merchandise Store',
                mockups: [
                    { id: 'merch_portrait', name: 'Merch Store - Portrait', image: 'mockup-images/sports/merch-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'merch_landscape', name: 'Merch Store - Landscape', image: 'mockup-images/sports/merch-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            bowlingAlley: {
                id: 'bowlingAlley',
                name: 'Bowling Alley',
                mockups: [
                    { id: 'bowling_portrait', name: 'Bowling Alley - Portrait', image: 'mockup-images/sports/bowling-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'bowling_landscape', name: 'Bowling Alley - Landscape', image: 'mockup-images/sports/bowling-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            golfCourse: {
                id: 'golfCourse',
                name: 'Golf Course',
                mockups: [
                    { id: 'golf_portrait', name: 'Golf Course - Portrait', image: 'mockup-images/sports/golf-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'golf_landscape', name: 'Golf Course - Landscape', image: 'mockup-images/sports/golf-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            sportsComplex: {
                id: 'sportsComplex',
                name: 'Sports Complex',
                mockups: [
                    { id: 'complex_portrait', name: 'Sports Complex - Portrait', image: 'mockup-images/sports/complex-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'complex_landscape', name: 'Sports Complex - Landscape', image: 'mockup-images/sports/complex-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            fanConvention: {
                id: 'fanConvention',
                name: 'Fan Convention',
                mockups: [
                    { id: 'convention_portrait', name: 'Fan Convention - Portrait', image: 'mockup-images/sports/convention-portrait.png', orientation: 'portrait', description: 'Vertical booth' },
                    { id: 'convention_landscape', name: 'Fan Convention - Landscape', image: 'mockup-images/sports/convention-landscape.png', orientation: 'landscape', description: 'Horizontal booth' }
                ]
            }
        }
    },

    musicLovers: {
        id: 'musicLovers',
        name: 'Music Lovers',
        icon: '🎵',
        description: 'Target music enthusiasts',
        locations: {
            concertVenue: {
                id: 'concertVenue',
                name: 'Concert Venue',
                mockups: [
                    { id: 'concert_music_portrait', name: 'Concert Venue - Portrait', image: 'mockup-images/music/concert-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'concert_music_landscape', name: 'Concert Venue - Landscape', image: 'mockup-images/music/concert-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            musicFestival: {
                id: 'musicFestival',
                name: 'Music Festival',
                mockups: [
                    { id: 'festival_music_portrait', name: 'Music Festival - Portrait', image: 'mockup-images/music/festival-portrait.png', orientation: 'portrait', description: 'Vertical stage banner' },
                    { id: 'festival_music_landscape', name: 'Music Festival - Landscape', image: 'mockup-images/music/festival-landscape.png', orientation: 'landscape', description: 'Horizontal stage banner' }
                ]
            },
            recordStore: {
                id: 'recordStore',
                name: 'Record Store',
                mockups: [
                    { id: 'record_portrait', name: 'Record Store - Portrait', image: 'mockup-images/music/record-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'record_landscape', name: 'Record Store - Landscape', image: 'mockup-images/music/record-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            musicHall: {
                id: 'musicHall',
                name: 'Music Hall',
                mockups: [
                    { id: 'hall_portrait', name: 'Music Hall - Portrait', image: 'mockup-images/music/hall-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'hall_landscape', name: 'Music Hall - Landscape', image: 'mockup-images/music/hall-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            jazzClub: {
                id: 'jazzClub',
                name: 'Jazz Club',
                mockups: [
                    { id: 'jazz_portrait', name: 'Jazz Club - Portrait', image: 'mockup-images/music/jazz-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'jazz_landscape', name: 'Jazz Club - Landscape', image: 'mockup-images/music/jazz-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            headphoneStore: {
                id: 'headphoneStore',
                name: 'Headphone Store',
                mockups: [
                    { id: 'headphone_portrait', name: 'Headphone Store - Portrait', image: 'mockup-images/music/headphone-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'headphone_landscape', name: 'Headphone Store - Landscape', image: 'mockup-images/music/headphone-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            instrumentShop: {
                id: 'instrumentShop',
                name: 'Music Instrument Shop',
                mockups: [
                    { id: 'instrument_portrait', name: 'Instrument Shop - Portrait', image: 'mockup-images/music/instrument-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'instrument_landscape', name: 'Instrument Shop - Landscape', image: 'mockup-images/music/instrument-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            rehearsalSpace: {
                id: 'rehearsalSpace',
                name: 'Band Rehearsal Space',
                mockups: [
                    { id: 'rehearsal_portrait', name: 'Rehearsal Space - Portrait', image: 'mockup-images/music/rehearsal-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'rehearsal_landscape', name: 'Rehearsal Space - Landscape', image: 'mockup-images/music/rehearsal-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            }
        }
    },

    gamers: {
        id: 'gamers',
        name: 'Gamers',
        icon: '🎮',
        description: 'Target gaming enthusiasts',
        locations: {
            gamingStore: {
                id: 'gamingStore',
                name: 'Gaming Store',
                mockups: [
                    { id: 'gamingstore_portrait', name: 'Gaming Store - Portrait', image: 'mockup-images/gamers/gamingstore-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'gamingstore_landscape', name: 'Gaming Store - Landscape', image: 'mockup-images/gamers/gamingstore-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            esportsArena: {
                id: 'esportsArena',
                name: 'Esports Arena',
                mockups: [
                    { id: 'esports_portrait', name: 'Esports Arena - Portrait', image: 'mockup-images/gamers/esports-portrait.png', orientation: 'portrait', description: 'Vertical LED' },
                    { id: 'esports_landscape', name: 'Esports Arena - Landscape', image: 'mockup-images/gamers/esports-landscape.png', orientation: 'landscape', description: 'Horizontal LED' }
                ]
            },
            comicConvention: {
                id: 'comicConvention',
                name: 'Comic Convention',
                mockups: [
                    { id: 'comiccon_portrait', name: 'Comic Con - Portrait', image: 'mockup-images/gamers/comiccon-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'comiccon_landscape', name: 'Comic Con - Landscape', image: 'mockup-images/gamers/comiccon-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            electronicsStore: {
                id: 'electronicsStore',
                name: 'Electronics Store',
                mockups: [
                    { id: 'electronics_gamers_portrait', name: 'Electronics - Portrait', image: 'mockup-images/gamers/electronics-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'electronics_gamers_landscape', name: 'Electronics - Landscape', image: 'mockup-images/gamers/electronics-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            gamingCafe: {
                id: 'gamingCafe',
                name: 'Gaming Cafe',
                mockups: [
                    { id: 'gamingcafe_portrait', name: 'Gaming Cafe - Portrait', image: 'mockup-images/gamers/gamingcafe-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'gamingcafe_landscape', name: 'Gaming Cafe - Landscape', image: 'mockup-images/gamers/gamingcafe-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            arcade: {
                id: 'arcade',
                name: 'Arcade',
                mockups: [
                    { id: 'arcade_gamers_portrait', name: 'Arcade - Portrait', image: 'mockup-images/gamers/arcade-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'arcade_gamers_landscape', name: 'Arcade - Landscape', image: 'mockup-images/gamers/arcade-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            movieTheaterGaming: {
                id: 'movieTheaterGaming',
                name: 'Movie Theater (Gaming Event)',
                mockups: [
                    { id: 'theater_gaming_portrait', name: 'Theater Gaming - Portrait', image: 'mockup-images/gamers/theater-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'theater_gaming_landscape', name: 'Theater Gaming - Landscape', image: 'mockup-images/gamers/theater-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            universityGaming: {
                id: 'universityGaming',
                name: 'University Gaming Lounge',
                mockups: [
                    { id: 'uni_gaming_portrait', name: 'Uni Gaming - Portrait', image: 'mockup-images/gamers/uni-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'uni_gaming_landscape', name: 'Uni Gaming - Landscape', image: 'mockup-images/gamers/uni-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            }
        }
    },

    petOwners: {
        id: 'petOwners',
        name: 'Pet Owners',
        icon: '🐕',
        description: 'Target pet owners',
        locations: {
            petStore: {
                id: 'petStore',
                name: 'Pet Store',
                mockups: [
                    { id: 'petstore_portrait', name: 'Pet Store - Portrait', image: 'mockup-images/pets/petstore-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'petstore_landscape', name: 'Pet Store - Landscape', image: 'mockup-images/pets/petstore-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            veterinaryClinic: {
                id: 'veterinaryClinic',
                name: 'Veterinary Clinic',
                mockups: [
                    { id: 'vet_portrait', name: 'Vet Clinic - Portrait', image: 'mockup-images/pets/vet-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'vet_landscape', name: 'Vet Clinic - Landscape', image: 'mockup-images/pets/vet-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            dogPark: {
                id: 'dogPark',
                name: 'Dog Park',
                mockups: [
                    { id: 'dogpark_portrait', name: 'Dog Park - Portrait', image: 'mockup-images/pets/dogpark-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'dogpark_landscape', name: 'Dog Park - Landscape', image: 'mockup-images/pets/dogpark-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            petGrooming: {
                id: 'petGrooming',
                name: 'Pet Grooming Salon',
                mockups: [
                    { id: 'grooming_portrait', name: 'Grooming - Portrait', image: 'mockup-images/pets/grooming-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'grooming_landscape', name: 'Grooming - Landscape', image: 'mockup-images/pets/grooming-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            animalHospital: {
                id: 'animalHospital',
                name: 'Animal Hospital',
                mockups: [
                    { id: 'hospital_portrait', name: 'Animal Hospital - Portrait', image: 'mockup-images/pets/hospital-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'hospital_landscape', name: 'Animal Hospital - Landscape', image: 'mockup-images/pets/hospital-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            petFriendlyCafe: {
                id: 'petFriendlyCafe',
                name: 'Pet-Friendly Cafe',
                mockups: [
                    { id: 'petcafe_portrait', name: 'Pet Cafe - Portrait', image: 'mockup-images/pets/petcafe-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'petcafe_landscape', name: 'Pet Cafe - Landscape', image: 'mockup-images/pets/petcafe-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            outdoorTrail: {
                id: 'outdoorTrail',
                name: 'Outdoor Trail',
                mockups: [
                    { id: 'trail_pets_portrait', name: 'Trail - Portrait', image: 'mockup-images/pets/trail-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'trail_pets_landscape', name: 'Trail - Landscape', image: 'mockup-images/pets/trail-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            adoptionCenter: {
                id: 'adoptionCenter',
                name: 'Adoption Center',
                mockups: [
                    { id: 'adoption_portrait', name: 'Adoption Center - Portrait', image: 'mockup-images/pets/adoption-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'adoption_landscape', name: 'Adoption Center - Landscape', image: 'mockup-images/pets/adoption-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            }
        }
    },

    luxuryShoppers: {
        id: 'luxuryShoppers',
        name: 'Luxury Shoppers',
        icon: '💎',
        description: 'Target high-end luxury consumers',
        locations: {
            highEndMall: {
                id: 'highEndMall',
                name: 'High-End Mall',
                mockups: [
                    { id: 'luxmall_portrait', name: 'Luxury Mall - Portrait', image: 'mockup-images/luxury/luxmall-portrait.png', orientation: 'portrait', description: 'Vertical premium display' },
                    { id: 'luxmall_landscape', name: 'Luxury Mall - Landscape', image: 'mockup-images/luxury/luxmall-landscape.png', orientation: 'landscape', description: 'Horizontal premium display' }
                ]
            },
            luxuryCarDealer: {
                id: 'luxuryCarDealer',
                name: 'Luxury Car Dealership',
                mockups: [
                    { id: 'luxcar_portrait', name: 'Luxury Car - Portrait', image: 'mockup-images/luxury/luxcar-portrait.png', orientation: 'portrait', description: 'Vertical showroom display' },
                    { id: 'luxcar_landscape', name: 'Luxury Car - Landscape', image: 'mockup-images/luxury/luxcar-landscape.png', orientation: 'landscape', description: 'Horizontal showroom display' }
                ]
            },
            premiumHotel: {
                id: 'premiumHotel',
                name: 'Premium Hotel Lobby',
                mockups: [
                    { id: 'luxhotel_portrait', name: 'Premium Hotel - Portrait', image: 'mockup-images/luxury/luxhotel-portrait.png', orientation: 'portrait', description: 'Vertical elegant display' },
                    { id: 'luxhotel_landscape', name: 'Premium Hotel - Landscape', image: 'mockup-images/luxury/luxhotel-landscape.png', orientation: 'landscape', description: 'Horizontal elegant display' }
                ]
            },
            fineDining: {
                id: 'fineDining',
                name: 'Fine Dining Restaurant',
                mockups: [
                    { id: 'finedining_portrait', name: 'Fine Dining - Portrait', image: 'mockup-images/luxury/finedining-portrait.png', orientation: 'portrait', description: 'Vertical menu display' },
                    { id: 'finedining_landscape', name: 'Fine Dining - Landscape', image: 'mockup-images/luxury/finedining-landscape.png', orientation: 'landscape', description: 'Horizontal menu display' }
                ]
            },
            jewelryStore: {
                id: 'jewelryStore',
                name: 'Jewelry Store',
                mockups: [
                    { id: 'jewelry_portrait', name: 'Jewelry Store - Portrait', image: 'mockup-images/luxury/jewelry-portrait.png', orientation: 'portrait', description: 'Vertical showcase' },
                    { id: 'jewelry_landscape', name: 'Jewelry Store - Landscape', image: 'mockup-images/luxury/jewelry-landscape.png', orientation: 'landscape', description: 'Horizontal showcase' }
                ]
            },
            artGallery: {
                id: 'artGallery',
                name: 'Art Gallery',
                mockups: [
                    { id: 'gallery_portrait', name: 'Art Gallery - Portrait', image: 'mockup-images/luxury/gallery-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'gallery_landscape', name: 'Art Gallery - Landscape', image: 'mockup-images/luxury/gallery-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            countryClub: {
                id: 'countryClub',
                name: 'Country Club',
                mockups: [
                    { id: 'country_portrait', name: 'Country Club - Portrait', image: 'mockup-images/luxury/country-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'country_landscape', name: 'Country Club - Landscape', image: 'mockup-images/luxury/country-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            golfCourseLux: {
                id: 'golfCourseLux',
                name: 'Golf Course',
                mockups: [
                    { id: 'golf_lux_portrait', name: 'Golf Course - Portrait', image: 'mockup-images/luxury/golf-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'golf_lux_landscape', name: 'Golf Course - Landscape', image: 'mockup-images/luxury/golf-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            yachtClub: {
                id: 'yachtClub',
                name: 'Yacht Club',
                mockups: [
                    { id: 'yacht_portrait', name: 'Yacht Club - Portrait', image: 'mockup-images/luxury/yacht-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'yacht_landscape', name: 'Yacht Club - Landscape', image: 'mockup-images/luxury/yacht-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            privateAirport: {
                id: 'privateAirport',
                name: 'Private Airport Terminal',
                mockups: [
                    { id: 'private_air_portrait', name: 'Private Terminal - Portrait', image: 'mockup-images/luxury/private-portrait.png', orientation: 'portrait', description: 'Vertical exclusive display' },
                    { id: 'private_air_landscape', name: 'Private Terminal - Landscape', image: 'mockup-images/luxury/private-landscape.png', orientation: 'landscape', description: 'Horizontal exclusive display' }
                ]
            }
        }
    },

    nightlifeSeekers: {
        id: 'nightlifeSeekers',
        name: 'Night Life Seekers',
        icon: '🍸',
        description: 'Target nightlife and entertainment seekers',
        locations: {
            bar: {
                id: 'bar',
                name: 'Bar',
                mockups: [
                    { id: 'bar_night_portrait', name: 'Bar - Portrait', image: 'mockup-images/nightlife/bar-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'bar_night_landscape', name: 'Bar - Landscape', image: 'mockup-images/nightlife/bar-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            nightclub: {
                id: 'nightclub',
                name: 'Nightclub',
                mockups: [
                    { id: 'club_portrait', name: 'Nightclub - Portrait', image: 'mockup-images/nightlife/club-portrait.png', orientation: 'portrait', description: 'Vertical LED' },
                    { id: 'club_landscape', name: 'Nightclub - Landscape', image: 'mockup-images/nightlife/club-landscape.png', orientation: 'landscape', description: 'Horizontal LED' }
                ]
            },
            lateNightRestaurant: {
                id: 'lateNightRestaurant',
                name: 'Late-Night Restaurant',
                mockups: [
                    { id: 'latenight_portrait', name: 'Late Night - Portrait', image: 'mockup-images/nightlife/latenight-portrait.png', orientation: 'portrait', description: 'Vertical menu' },
                    { id: 'latenight_landscape', name: 'Late Night - Landscape', image: 'mockup-images/nightlife/latenight-landscape.png', orientation: 'landscape', description: 'Horizontal menu' }
                ]
            },
            entertainmentDistrict: {
                id: 'entertainmentDistrict',
                name: 'Entertainment District',
                mockups: [
                    { id: 'entertainment_portrait', name: 'Entertainment District - Portrait', image: 'mockup-images/nightlife/entertainment-portrait.png', orientation: 'portrait', description: 'Vertical street ad' },
                    { id: 'entertainment_landscape', name: 'Entertainment District - Landscape', image: 'mockup-images/nightlife/entertainment-landscape.png', orientation: 'landscape', description: 'Horizontal street ad' }
                ]
            },
            casino: {
                id: 'casino',
                name: 'Casino',
                mockups: [
                    { id: 'casino_portrait', name: 'Casino - Portrait', image: 'mockup-images/nightlife/casino-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'casino_landscape', name: 'Casino - Landscape', image: 'mockup-images/nightlife/casino-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            concertVenueNight: {
                id: 'concertVenueNight',
                name: 'Concert Venue',
                mockups: [
                    { id: 'concert_night_portrait', name: 'Concert - Portrait', image: 'mockup-images/nightlife/concert-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'concert_night_landscape', name: 'Concert - Landscape', image: 'mockup-images/nightlife/concert-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            comedyClub: {
                id: 'comedyClub',
                name: 'Comedy Club',
                mockups: [
                    { id: 'comedy_portrait', name: 'Comedy Club - Portrait', image: 'mockup-images/nightlife/comedy-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'comedy_landscape', name: 'Comedy Club - Landscape', image: 'mockup-images/nightlife/comedy-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            lounge: {
                id: 'lounge',
                name: 'Lounge',
                mockups: [
                    { id: 'lounge_portrait', name: 'Lounge - Portrait', image: 'mockup-images/nightlife/lounge-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'lounge_landscape', name: 'Lounge - Landscape', image: 'mockup-images/nightlife/lounge-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            hotelBar: {
                id: 'hotelBar',
                name: 'Hotel Bar',
                mockups: [
                    { id: 'hotelbar_portrait', name: 'Hotel Bar - Portrait', image: 'mockup-images/nightlife/hotelbar-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'hotelbar_landscape', name: 'Hotel Bar - Landscape', image: 'mockup-images/nightlife/hotelbar-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            lateNightDiner: {
                id: 'lateNightDiner',
                name: 'Late-Night Diner',
                mockups: [
                    { id: 'diner_portrait', name: 'Diner - Portrait', image: 'mockup-images/nightlife/diner-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'diner_landscape', name: 'Diner - Landscape', image: 'mockup-images/nightlife/diner-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            }
        }
    },

    outdoorEnthusiasts: {
        id: 'outdoorEnthusiasts',
        name: 'Outdoor Enthusiasts',
        icon: '⛰️',
        description: 'Target outdoor adventure lovers',
        locations: {
            campingStore: {
                id: 'campingStore',
                name: 'Camping Store',
                mockups: [
                    { id: 'camping_portrait', name: 'Camping Store - Portrait', image: 'mockup-images/outdoor-enthus/camping-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'camping_landscape', name: 'Camping Store - Landscape', image: 'mockup-images/outdoor-enthus/camping-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            hikingTrail: {
                id: 'hikingTrail',
                name: 'Hiking Trail',
                mockups: [
                    { id: 'hiking_portrait', name: 'Hiking Trail - Portrait', image: 'mockup-images/outdoor-enthus/hiking-portrait.png', orientation: 'portrait', description: 'Vertical trailhead sign' },
                    { id: 'hiking_landscape', name: 'Hiking Trail - Landscape', image: 'mockup-images/outdoor-enthus/hiking-landscape.png', orientation: 'landscape', description: 'Horizontal trailhead sign' }
                ]
            },
            nationalPark: {
                id: 'nationalPark',
                name: 'National Park',
                mockups: [
                    { id: 'park_outdoor_portrait', name: 'National Park - Portrait', image: 'mockup-images/outdoor-enthus/park-portrait.png', orientation: 'portrait', description: 'Vertical info board' },
                    { id: 'park_outdoor_landscape', name: 'National Park - Landscape', image: 'mockup-images/outdoor-enthus/park-landscape.png', orientation: 'landscape', description: 'Horizontal info board' }
                ]
            },
            outdoorEquipment: {
                id: 'outdoorEquipment',
                name: 'Outdoor Equipment Store',
                mockups: [
                    { id: 'equipment_portrait', name: 'Equipment Store - Portrait', image: 'mockup-images/outdoor-enthus/equipment-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'equipment_landscape', name: 'Equipment Store - Landscape', image: 'mockup-images/outdoor-enthus/equipment-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            bikeShop: {
                id: 'bikeShop',
                name: 'Bike Shop',
                mockups: [
                    { id: 'bike_portrait', name: 'Bike Shop - Portrait', image: 'mockup-images/outdoor-enthus/bike-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'bike_landscape', name: 'Bike Shop - Landscape', image: 'mockup-images/outdoor-enthus/bike-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            sportingGoods: {
                id: 'sportingGoods',
                name: 'Sporting Goods Store',
                mockups: [
                    { id: 'sporting_portrait', name: 'Sporting Goods - Portrait', image: 'mockup-images/outdoor-enthus/sporting-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'sporting_landscape', name: 'Sporting Goods - Landscape', image: 'mockup-images/outdoor-enthus/sporting-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            marina: {
                id: 'marina',
                name: 'Marina',
                mockups: [
                    { id: 'marina_portrait', name: 'Marina - Portrait', image: 'mockup-images/outdoor-enthus/marina-portrait.png', orientation: 'portrait', description: 'Vertical sign' },
                    { id: 'marina_landscape', name: 'Marina - Landscape', image: 'mockup-images/outdoor-enthus/marina-landscape.png', orientation: 'landscape', description: 'Horizontal sign' }
                ]
            },
            skiResort: {
                id: 'skiResort',
                name: 'Ski Resort',
                mockups: [
                    { id: 'ski_portrait', name: 'Ski Resort - Portrait', image: 'mockup-images/outdoor-enthus/ski-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'ski_landscape', name: 'Ski Resort - Landscape', image: 'mockup-images/outdoor-enthus/ski-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            rockClimbing: {
                id: 'rockClimbing',
                name: 'Rock Climbing Gym',
                mockups: [
                    { id: 'climbing_portrait', name: 'Climbing Gym - Portrait', image: 'mockup-images/outdoor-enthus/climbing-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'climbing_landscape', name: 'Climbing Gym - Landscape', image: 'mockup-images/outdoor-enthus/climbing-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            natureCenter: {
                id: 'natureCenter',
                name: 'Nature Center',
                mockups: [
                    { id: 'nature_portrait', name: 'Nature Center - Portrait', image: 'mockup-images/outdoor-enthus/nature-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'nature_landscape', name: 'Nature Center - Landscape', image: 'mockup-images/outdoor-enthus/nature-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            }
        }
    },

    businessOwners: {
        id: 'businessOwners',
        name: 'Business Owners',
        icon: '🏢',
        description: 'Target entrepreneurs and business owners',
        locations: {
            chamberCommerce: {
                id: 'chamberCommerce',
                name: 'Chamber of Commerce',
                mockups: [
                    { id: 'chamber_portrait', name: 'Chamber - Portrait', image: 'mockup-images/business/chamber-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'chamber_landscape', name: 'Chamber - Landscape', image: 'mockup-images/business/chamber-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            businessExpo: {
                id: 'businessExpo',
                name: 'Business Expo',
                mockups: [
                    { id: 'expo_portrait', name: 'Business Expo - Portrait', image: 'mockup-images/business/expo-portrait.png', orientation: 'portrait', description: 'Vertical booth banner' },
                    { id: 'expo_landscape', name: 'Business Expo - Landscape', image: 'mockup-images/business/expo-landscape.png', orientation: 'landscape', description: 'Horizontal booth banner' }
                ]
            },
            coworkingSpace: {
                id: 'coworkingSpace',
                name: 'Coworking Space',
                mockups: [
                    { id: 'coworking_portrait', name: 'Coworking - Portrait', image: 'mockup-images/business/coworking-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'coworking_landscape', name: 'Coworking - Landscape', image: 'mockup-images/business/coworking-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            officeSupply: {
                id: 'officeSupply',
                name: 'Office Supply Store',
                mockups: [
                    { id: 'officesupply_portrait', name: 'Office Supply - Portrait', image: 'mockup-images/business/officesupply-portrait.png', orientation: 'portrait', description: 'Vertical display' },
                    { id: 'officesupply_landscape', name: 'Office Supply - Landscape', image: 'mockup-images/business/officesupply-landscape.png', orientation: 'landscape', description: 'Horizontal display' }
                ]
            },
            bank: {
                id: 'bank',
                name: 'Bank',
                mockups: [
                    { id: 'bank_business_portrait', name: 'Bank - Portrait', image: 'mockup-images/business/bank-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'bank_business_landscape', name: 'Bank - Landscape', image: 'mockup-images/business/bank-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            },
            printShop: {
                id: 'printShop',
                name: 'Print Shop',
                mockups: [
                    { id: 'print_portrait', name: 'Print Shop - Portrait', image: 'mockup-images/business/print-portrait.png', orientation: 'portrait', description: 'Vertical poster' },
                    { id: 'print_landscape', name: 'Print Shop - Landscape', image: 'mockup-images/business/print-landscape.png', orientation: 'landscape', description: 'Horizontal poster' }
                ]
            },
            businessDistrict: {
                id: 'businessDistrict',
                name: 'Business District',
                mockups: [
                    { id: 'bizdistrict_portrait', name: 'Business District - Portrait', image: 'mockup-images/business/bizdistrict-portrait.png', orientation: 'portrait', description: 'Vertical billboard' },
                    { id: 'bizdistrict_landscape', name: 'Business District - Landscape', image: 'mockup-images/business/bizdistrict-landscape.png', orientation: 'landscape', description: 'Horizontal billboard' }
                ]
            },
            networkingEvent: {
                id: 'networkingEvent',
                name: 'Networking Event Venue',
                mockups: [
                    { id: 'networking_portrait', name: 'Networking Event - Portrait', image: 'mockup-images/business/networking-portrait.png', orientation: 'portrait', description: 'Vertical banner' },
                    { id: 'networking_landscape', name: 'Networking Event - Landscape', image: 'mockup-images/business/networking-landscape.png', orientation: 'landscape', description: 'Horizontal banner' }
                ]
            },
            conventionCenter: {
                id: 'conventionCenter',
                name: 'Convention Center',
                mockups: [
                    { id: 'convention_business_portrait', name: 'Convention - Portrait', image: 'mockup-images/business/convention-portrait.png', orientation: 'portrait', description: 'Vertical screen' },
                    { id: 'convention_business_landscape', name: 'Convention - Landscape', image: 'mockup-images/business/convention-landscape.png', orientation: 'landscape', description: 'Horizontal screen' }
                ]
            }
        }
    },

    // Keep existing general audience with your current mockups
    general: {
        id: 'general',
        name: 'General Audience',
        icon: '🌐',
        description: 'Broad audience reach',
        locations: {
            atHome: {
                id: 'atHome',
                name: 'At Home',
                mockups: [
                    { id: 'mobileHand', name: 'Mobile in Hand', image: 'mockup-images/at-home/mobile-hand.png', orientation: 'portrait', description: 'Social media, apps, mobile content' },
                    { id: 'computerScreen', name: 'Computer Screen', image: 'mockup-images/at-home/computer-screen.png', orientation: 'landscape', description: 'Websites, email campaigns' },
                    { id: 'tvScreen', name: 'TV Screen', image: 'mockup-images/at-home/tv-screen.png', orientation: 'landscape', description: 'Video ads, streaming content' }
                ]
            },
            outdoor: {
                id: 'outdoor',
                name: 'Outdoor',
                mockups: [
                    { id: 'streetKiosk', name: 'Street Kiosk', image: 'mockup-images/outdoor/street-kiosk.png', orientation: 'portrait', description: 'Vertical street advertising' },
                    { id: 'highwayBillboard', name: 'Highway Billboard', image: 'mockup-images/outdoor/highway-billboard.png', orientation: 'landscape', description: 'Large outdoor advertising' },
                    { id: 'busShelter', name: 'Bus Shelter', image: 'mockup-images/outdoor/bus-shelter.png', orientation: 'landscape', description: 'Transit advertising' },
                    { id: 'mallDigital', name: 'Mall Digital Screen', image: 'mockup-images/outdoor/mall-digital.png', orientation: 'portrait', description: 'Indoor digital advertising' },
                    { id: 'instoreVeg', name: 'In-Store Grocery', image: 'mockup-images/outdoor/instore-ad-veg.png', orientation: 'landscape', description: 'Indoor digital advertising' },
                    { id: 'wembleyStadium', name: 'Wembley Stadium', image: 'mockup-images/outdoor/wembley-stadium-ad.png', orientation: 'landscape', description: 'Stadium advertising' },
                    { id: 'outdoorAirport', name: 'Outdoor Airport', image: 'mockup-images/outdoor/outdoor-airport.png', orientation: 'landscape', description: 'Airport outdoor advertising' },
                    { id: 'airportCheckin', name: 'Airport Check-in', image: 'mockup-images/outdoor/airport-checkin-ad.png', orientation: 'portrait', description: 'Airport check-in area' },
                    { id: 'tubeTrain', name: 'Tube Train', image: 'mockup-images/outdoor/tube-train-ads.png', orientation: 'landscape', description: 'Train/subway advertising' },
                    { id: 'outdoorGrocery', name: 'Outdoor Grocery', image: 'mockup-images/outdoor/outdoor-grocery-ad.png', orientation: 'landscape', description: 'Grocery store outdoor' }
                ]
            },
            onTheGo: {
                id: 'onTheGo',
                name: 'On The Go',
                mockups: [
                    { id: 'pamphletHand', name: 'Pamphlet in Hand', image: 'mockup-images/on-the-go/pamphlet-hand.png', orientation: 'portrait', description: 'Flyers, brochures, handouts' },
                    { id: 'newspaper', name: 'Newspaper', image: 'mockup-images/on-the-go/newspaper.png', orientation: 'landscape', description: 'Print ads, newspaper inserts' }
                ]
            }
        }
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getAllAudiences() {
    return Object.values(MOCKUP_CONFIG).map(audience => ({
        id: audience.id,
        name: audience.name,
        icon: audience.icon,
        description: audience.description
    }));
}

function getLocationsByAudience(audienceId) {
    const audience = MOCKUP_CONFIG[audienceId];
    if (!audience || !audience.locations) return [];
    
    return Object.values(audience.locations).map(location => ({
        id: location.id,
        name: location.name,
        audienceId: audienceId,
        mockupCount: location.mockups.length
    }));
}

function getMockupsByAudienceAndLocation(audienceId, locationId) {
    const audience = MOCKUP_CONFIG[audienceId];
    if (!audience || !audience.locations) return [];
    
    const location = audience.locations[locationId];
    if (!location || !location.mockups) return [];
    
    return location.mockups.map(mockup => ({
        ...mockup,
        audienceId: audienceId,
        audienceName: audience.name,
        audienceIcon: audience.icon,
        locationId: locationId,
        locationName: location.name
    }));
}

function getAllMockups() {
    const allMockups = [];
    
    Object.values(MOCKUP_CONFIG).forEach(audience => {
        Object.values(audience.locations).forEach(location => {
            location.mockups.forEach(mockup => {
                allMockups.push({
                    ...mockup,
                    audienceId: audience.id,
                    audienceName: audience.name,
                    audienceIcon: audience.icon,
                    locationId: location.id,
                    locationName: location.name
                });
            });
        });
    });
    
    return allMockups;
}

function findMockupById(mockupId) {
    return getAllMockups().find(m => m.id === mockupId) || null;
}

function getMockupsByOrientation(orientation) {
    return getAllMockups().filter(m => m.orientation === orientation);
}

function searchMockups(keyword) {
    const term = keyword.toLowerCase();
    return getAllMockups().filter(m => 
        m.name.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term) ||
        m.audienceName.toLowerCase().includes(term) ||
        m.locationName.toLowerCase().includes(term)
    );
}

function getMockupStats() {
    const allMockups = getAllMockups();
    return {
        totalAudiences: Object.keys(MOCKUP_CONFIG).length,
        totalLocations: Object.values(MOCKUP_CONFIG).reduce((sum, aud) => 
            sum + Object.keys(aud.locations).length, 0),
        totalMockups: allMockups.length,
        portraitMockups: allMockups.filter(m => m.orientation === 'portrait').length,
        landscapeMockups: allMockups.filter(m => m.orientation === 'landscape').length
    };
}