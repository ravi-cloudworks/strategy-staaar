// Location-specific images for better visual variety
const LOCATION_IMAGES = {
    // Athletic & Fitness
    gymFitness: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    sportsStadium: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop',
    runningTrack: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop',
    sportsBar: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
    athleticStore: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop',
    supplementStore: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop',
    outdoorPark: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    swimmingPool: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop',
    boxingGym: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=300&fit=crop',
    yogaStudio: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop',
    danceStudio: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=300&fit=crop',
    pilatesStudio: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
    healthFoodStore: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    spaWellness: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop',
    parkTrail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
    
    // Shopping & Retail
    groceryStore: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&h=300&fit=crop',
    supermarket: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=300&fit=crop',
    departmentStore: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    clothingStore: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop',
    homeGoodsStore: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop',
    beautySalon: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
    bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    pharmacy: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=300&fit=crop',
    farmersMarket: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop',
    craftStore: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop',
    shoppingMall: 'https://images.unsplash.com/photo-1555529902-5261145633bf?w=400&h=300&fit=crop',
    fashionBoutique: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop',
    shoeStore: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop',
    beautyStore: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
    accessoryShop: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=300&fit=crop',
    designerOutlet: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    fashionDistrict: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
    
    // Professional & Business
    airport: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
    trainStation: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
    officeBuilding: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    coffeeShop: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop',
    businessDistrict: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    hotelLobby: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
    conferenceCenter: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
    parkingGarage: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400&h=300&fit=crop',
    corporateCampus: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    businessRestaurant: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    
    // Children & Family
    toyStore: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop',
    playground: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop',
    amusementPark: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&h=300&fit=crop',
    iceCreamShop: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
    schoolArea: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop',
    libraryKids: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=300&fit=crop',
    movieTheater: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop',
    arcade: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=300&fit=crop',
    pizzaRestaurant: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    sportsField: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop',
    pediatricClinic: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop',
    daycarePickup: 'https://images.unsplash.com/photo-1587616211892-e83e1c328129?w=400&h=300&fit=crop',
    childrensMuseum: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=400&h=300&fit=crop',
    familyRestaurant: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    playgroundPark: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
    babyStore: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop',
    
    // Teens & Students
    fastFood: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop',
    skateboardPark: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=400&h=300&fit=crop',
    highSchool: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
    bubbleTeaShop: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=300&fit=crop',
    musicStore: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop',
    concertVenue: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop',
    universityCampus: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
    library: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=300&fit=crop',
    studentUnion: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
    budgetRestaurant: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop',
    bookstore: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop',
    laundromat: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&h=300&fit=crop',
    busStop: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop',
    dormCommon: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
    fastCasual: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    
    // Travel & Transit
    busTerminal: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
    touristInfo: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop',
    rentalCar: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
    highwayRest: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=400&h=300&fit=crop',
    cruiseTerminal: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=400&h=300&fit=crop',
    touristAttractions: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop',
    souvenirShop: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=400&h=300&fit=crop',
    subwayMetro: 'https://images.unsplash.com/photo-1545311395-f8ff0e80f2dc?w=400&h=300&fit=crop',
    trainPlatform: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
    highwayBillboard: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    gasStation: 'https://images.unsplash.com/photo-1545105511-ec4c6b58d1f6?w=400&h=300&fit=crop',
    carWash: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=300&fit=crop',
    trafficIntersection: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
    ridesharePickup: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
    
    // Senior & Healthcare
    medicalCenter: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop',
    communityCenter: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    parkBench: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=300&fit=crop',
    bank: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&h=300&fit=crop',
    postOffice: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=400&h=300&fit=crop',
    gardenCenter: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    restaurantEarly: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    
    // Food & Dining
    restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    foodCourt: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    gourmetStore: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    cookingStore: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop',
    wineShop: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
    coffeeRoaster: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop',
    foodFestival: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    culinarySchool: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop',
    
    // Tech & Electronics
    electronicsStore: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    techConference: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
    startupHub: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    computerStore: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=400&h=300&fit=crop',
    gamingLounge: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    bookstoreTech: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    techCoffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    engineering: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=400&h=300&fit=crop',
    
    // Health & Wellness
    organicMarket: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop',
    juiceBar: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop',
    vitaminShop: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    wellnessCenter: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
    spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop',
    runningTrail: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&h=300&fit=crop',
    meditationCenter: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
    
    // Sports & Entertainment
    arena: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=300&fit=crop',
    tailgateArea: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop',
    sportsMerch: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop',
    bowlingAlley: 'https://images.unsplash.com/photo-1599475321856-8a818b2ebc87?w=400&h=300&fit=crop',
    golfCourse: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop',
    sportsComplex: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
    fanConvention: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
    musicFestival: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
    recordStore: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=300&fit=crop',
    musicHall: 'https://images.unsplash.com/photo-1519683109079-d5f539e1542f?w=400&h=300&fit=crop',
    jazzClub: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=300&fit=crop',
    headphoneStore: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop',
    instrumentShop: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop',
    rehearsalSpace: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop',
    
    // Gaming
    gamingStore: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop',
    esportsArena: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    comicConvention: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=300&fit=crop',
    gamingCafe: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
    movieTheaterGaming: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop',
    universityGaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    
    // Pets
    petStore: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&h=300&fit=crop',
    veterinaryClinic: 'https://images.unsplash.com/photo-1530041539828-114de669390e?w=400&h=300&fit=crop',
    dogPark: 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=400&h=300&fit=crop',
    petGrooming: 'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=400&h=300&fit=crop',
    animalHospital: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=300&fit=crop',
    petFriendlyCafe: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop',
    outdoorTrail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
    adoptionCenter: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
    
    // Luxury
    highEndMall: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&h=300&fit=crop',
    luxuryCarDealer: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=400&h=300&fit=crop',
    premiumHotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    fineDining: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    jewelryStore: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
    artGallery: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&h=300&fit=crop',
    countryClub: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=300&fit=crop',
    golfCourseLux: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop',
    yachtClub: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    privateAirport: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=400&h=300&fit=crop',
    
    // Nightlife
    bar: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&h=300&fit=crop',
    nightclub: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400&h=300&fit=crop',
    lateNightRestaurant: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
    entertainmentDistrict: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
    casino: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=300&fit=crop',
    concertVenueNight: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
    comedyClub: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&h=300&fit=crop',
    lounge: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=300&fit=crop',
    hotelBar: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=300&fit=crop',
    lateNightDiner: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop',
    
    // Outdoor & Adventure
    campingStore: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop',
    hikingTrail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
    nationalPark: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    outdoorEquipment: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=400&h=300&fit=crop',
    bikeShop: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&h=300&fit=crop',
    sportingGoods: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop',
    marina: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    skiResort: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    rockClimbing: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=300&fit=crop',
    natureCenter: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    
    // Business & Networking
    chamberCommerce: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop',
    businessExpo: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
    coworkingSpace: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop',
    officeSupply: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
    printShop: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=300&fit=crop',
    networkingEvent: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
    conventionCenter: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop',
    
    // General
    atHome: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
    outdoor: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    onTheGo: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=400&h=300&fit=crop'
};

const AUDIENCE_IMAGES = {
    athleticMen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    athleticWomen: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
    housewives: 'https://images.unsplash.com/photo-1556910110-17b0f0e64476?w=400&h=300&fit=crop',
    workingProfessionals: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
    children: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
    teenagers: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&h=300&fit=crop',
    collegeStudents: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
    travelers: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    commuters: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
    seniors: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&h=300&fit=crop',
    parentsYoungKids: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop',
    foodEnthusiasts: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    fashionShoppers: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
    techEnthusiasts: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
    healthConscious: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
    sportsFans: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop',
    musicLovers: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop',
    gamers: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    petOwners: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
    luxuryShoppers: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=400&h=300&fit=crop',
    nightlifeSeekers: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
    outdoorEnthusiasts: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
    businessOwners: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    general: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
};// Main Application Logic - Single Page with Filters
// Version 16 - Fresh code with INSERT YOUR AD HERE overlay

// State
let selectedAudience = null;
let selectedLocation = null;
let selectedMockup = null;
let mockupImage = null;
let contentImage = null;
let detectedCorners = null;
let detectedDimensions = null;
let detectedAngle = 0;
let debugMode = false; // Debug visualization toggle

// DOM Elements
const compactNav = document.getElementById('compactNav');
const audienceFilter = document.getElementById('audienceFilter');
const locationFilter = document.getElementById('locationFilter');
const resetFilters = document.getElementById('resetFilters');

const mockupSection = document.getElementById('mockupSection');
const mockupGrid = document.getElementById('mockupGrid');
const mockupSubtitle = document.getElementById('mockupSubtitle');
const emptyState = document.getElementById('emptyState');

const workspace = document.getElementById('workspace');
const backBtn = document.getElementById('backBtn');
const canvasContainer = document.getElementById('canvasContainer');
const contentInput = document.getElementById('contentInput');
const resultCanvas = document.getElementById('resultCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const debugToggle = document.getElementById('debugToggle');
const status = document.getElementById('status');
const mockupTitle = document.getElementById('mockupTitle');
const dimensionDisplay = document.getElementById('dimensionDisplay');


// Helper function to get the best image for a mockup
function getMockupImage(mockup) {
    return LOCATION_IMAGES[mockup.locationId] || AUDIENCE_IMAGES[mockup.audienceId] || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop';
}

// Initialize App
function init() {
    console.log('🚀 App initializing...');
    populateFilters();
    renderAllMockups();
    setupEventListeners();
    updateSubtitle();
    compactNav.style.display = 'flex';
    showStatus('Browse mockups or use filters to narrow down', 'success');
}

// Populate filter dropdowns
function populateFilters() {
    const audiences = getAllAudiences();
    
    audienceFilter.innerHTML = '<option value="">All Audiences</option>';
    audiences.forEach(aud => {
        const option = document.createElement('option');
        option.value = aud.id;
        option.textContent = aud.name;
        audienceFilter.appendChild(option);
    });
}

// Update location filter based on selected audience
function updateLocationFilter() {
    const audienceId = audienceFilter.value;
    
    if (!audienceId) {
        locationFilter.disabled = true;
        locationFilter.innerHTML = '<option value="">Select audience first</option>';
        selectedAudience = null;
        selectedLocation = null;
        return;
    }
    
    selectedAudience = audienceId;
    const locations = getLocationsByAudience(audienceId);
    
    locationFilter.disabled = false;
    locationFilter.innerHTML = '<option value="">All Locations</option>';
    
    locations.forEach(loc => {
        const option = document.createElement('option');
        option.value = loc.id;
        option.textContent = `${loc.name} (${loc.mockupCount} mockups)`;
        locationFilter.appendChild(option);
    });
    
    selectedLocation = null;
}

// Update subtitle with stats
function updateSubtitle() {
    const stats = getMockupStats();
    let text = `${stats.totalAudiences} audiences • ${stats.totalLocations} locations • ${stats.totalMockups} mockup options`;
    
    if (selectedAudience && selectedLocation) {
        const mockups = getMockupsByAudienceAndLocation(selectedAudience, selectedLocation);
        const audienceName = MOCKUP_CONFIG[selectedAudience].name;
        const locationName = MOCKUP_CONFIG[selectedAudience].locations[selectedLocation].name;
        text = `Target ${audienceName} at ${locationName} in ${mockups.length} ways`;
    } else if (selectedAudience) {
        const locations = getLocationsByAudience(selectedAudience);
        const total = locations.reduce((sum, loc) => sum + loc.mockupCount, 0);
        const audienceName = MOCKUP_CONFIG[selectedAudience].name;
        text = `Target ${audienceName} in ${locations.length} location${locations.length !== 1 ? 's' : ''} with ${total} mockup${total !== 1 ? 's' : ''}`;
    }
    
    mockupSubtitle.textContent = text;
}

// Render all mockups or filtered mockups
function renderAllMockups() {
    mockupGrid.innerHTML = '';
    let mockups = [];
    
    if (selectedAudience && selectedLocation) {
        mockups = getMockupsByAudienceAndLocation(selectedAudience, selectedLocation);
    } else if (selectedAudience) {
        const locations = getLocationsByAudience(selectedAudience);
        locations.forEach(loc => {
            const locMockups = getMockupsByAudienceAndLocation(selectedAudience, loc.id);
            mockups.push(...locMockups);
        });
    } else {
        mockups = getAllMockups();
    }
    
    if (mockups.length === 0) {
        emptyState.style.display = 'block';
        mockupGrid.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    mockupGrid.style.display = 'grid';
    
    mockups.forEach(mockup => {
        const card = document.createElement('div');
        card.className = 'mockup-card';
        
        const fallbackImage = getMockupImage(mockup);
        
        card.innerHTML = `
            <img src="${mockup.image}" alt="${mockup.name}" class="mockup-thumbnail" 
                 onerror="this.src='${fallbackImage}'">
            <div class="mockup-card-content">
                <div class="mockup-orientation ${mockup.orientation}">${mockup.orientation === 'portrait' ? '📱 Portrait' : '🖥️ Landscape'}</div>
                <div class="mockup-name">${mockup.name}</div>
                <div class="mockup-desc">${mockup.description}</div>
                <div class="mockup-meta">
                    ${mockup.audienceIcon} ${mockup.audienceName} → ${mockup.locationName}
                </div>
            </div>
        `;
        card.addEventListener('click', () => selectMockup(mockup));
        mockupGrid.appendChild(card);
    });
    
    updateSubtitle();
}

// Select Mockup and Open Workspace
function selectMockup(mockup) {
    console.log('📌 Mockup selected:', mockup);
    selectedMockup = mockup;

    mockupSection.style.display = 'none';
    compactNav.style.display = 'none';
    workspace.classList.add('active');

    mockupTitle.innerHTML = `
        ${mockup.audienceIcon} ${mockup.audienceName} → ${mockup.locationName} → ${mockup.name}
    `;

    loadMockupImage(mockup.image);
    showStatus(`${mockup.name} loaded. Click on canvas or paste (Ctrl+V) to add your content.`, 'success');
}

// Load Mockup Image
function loadMockupImage(imagePath) {
    console.log('🖼️  Loading mockup image:', imagePath);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
        console.log('✅ Mockup image loaded successfully');
        mockupImage = img;
        detectedCorners = detectTransparentArea(img);

        console.log('🔍 Detected corners:', detectedCorners);

        if (detectedCorners) {
            const width = Math.round(detectedCorners.topRight.x - detectedCorners.topLeft.x);
            const height = Math.round(detectedCorners.bottomLeft.y - detectedCorners.topLeft.y);
            detectedDimensions = { width, height };

            const bottomDeltaX = detectedCorners.bottomRight.x - detectedCorners.bottomLeft.x;
            const bottomDeltaY = detectedCorners.bottomRight.y - detectedCorners.bottomLeft.y;
            detectedAngle = Math.atan2(bottomDeltaY, bottomDeltaX);

            console.log('📏 Dimensions:', width, 'x', height);
        } else {
            console.warn('⚠️  No transparent corners detected!');
        }

        console.log('🎨 About to call drawMockup()');
        drawMockup();
        console.log('✅ drawMockup() completed');

        showStatus('Mockup ready! Click or paste your content.', 'success');
    };
    
    img.onerror = () => {
        console.error('❌ Error loading mockup image:', imagePath);
        showStatus('Error loading mockup image. Using placeholder.', 'error');
        mockupImage = createPlaceholderImage(1200, 800, selectedMockup.name);
        detectedCorners = {
            topLeft: { x: 240, y: 160 },
            topRight: { x: 960, y: 160 },
            bottomRight: { x: 960, y: 640 },
            bottomLeft: { x: 240, y: 640 }
        };
        detectedDimensions = { width: 720, height: 480 };
        detectedAngle = 0;
        drawMockup();
    };
    
    img.src = imagePath;
}

// Create Placeholder Image
function createPlaceholderImage(width, height, text) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    const transparentWidth = width * 0.6;
    const transparentHeight = height * 0.6;
    const transparentX = (width - transparentWidth) / 2;
    const transparentY = (height - transparentHeight) / 2;

    ctx.clearRect(transparentX, transparentY, transparentWidth, transparentHeight);

    ctx.strokeStyle = '#999';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(transparentX, transparentY, transparentWidth, transparentHeight);

    ctx.fillStyle = '#999';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, width / 2, 40);
    ctx.font = '16px Arial';
    ctx.fillText('Placeholder Mockup', width / 2, 70);

    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
}

// Draw mockup (with or without content)
function drawMockup() {
    console.log('🎨 drawMockup() called, mockupImage exists:', !!mockupImage, 'detectedCorners exists:', !!detectedCorners, 'contentImage exists:', !!contentImage);
    
    if (!mockupImage) {
        console.warn('⚠️  No mockupImage, exiting drawMockup()');
        return;
    }

    resultCanvas.width = mockupImage.width;
    resultCanvas.height = mockupImage.height;
    const ctx = resultCanvas.getContext('2d');

    ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

    // If we have content, draw it with perspective transform
    if (contentImage && detectedCorners) {
        console.log('🖼️  Drawing content image with perspective transform');
        ctx.save();

        const corners = detectedCorners;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = contentImage.width;
        tempCanvas.height = contentImage.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(contentImage, 0, 0);

        const src = cv.imread(tempCanvas);
        const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
            0, 0,
            contentImage.width, 0,
            contentImage.width, contentImage.height,
            0, contentImage.height
        ]);

        const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
            corners.topLeft.x, corners.topLeft.y,
            corners.topRight.x, corners.topRight.y,
            corners.bottomRight.x, corners.bottomRight.y,
            corners.bottomLeft.x, corners.bottomLeft.y
        ]);

        const M = cv.getPerspectiveTransform(srcTri, dstTri);
        const warped = new cv.Mat();
        cv.warpPerspective(
            src,
            warped,
            M,
            new cv.Size(mockupImage.width, mockupImage.height),
            cv.INTER_AREA,
            cv.BORDER_CONSTANT,
            new cv.Scalar(0, 0, 0, 0)
        );

        const imgData = new ImageData(
            new Uint8ClampedArray(warped.data),
            warped.cols,
            warped.rows
        );
        
        for (let i = 0; i < imgData.data.length; i += 4) {
            if (imgData.data[i + 3] < 10) {
                imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = 0;
                imgData.data[i + 3] = 0;
            }
        }
        ctx.putImageData(imgData, 0, 0);

        const fixData = ctx.getImageData(0, 0, resultCanvas.width, resultCanvas.height);
        const d = fixData.data;
        for (let i = 0; i < d.length; i += 4) {
            if (d[i + 3] > 0 && d[i + 3] < 255) {
                const a = d[i + 3] / 255;
                d[i] *= a;
                d[i + 1] *= a;
                d[i + 2] *= a;
            }
        }
        ctx.putImageData(fixData, 0, 0);

        src.delete(); 
        warped.delete(); 
        srcTri.delete(); 
        dstTri.delete(); 
        M.delete();

        ctx.restore();
    }

    // CRITICAL: Draw mockup overlay on top (this provides the frame around content)
    ctx.drawImage(mockupImage, 0, 0);
    console.log('✅ Mockup frame drawn on top');

    // VISUALIZATION: Show "Insert your ad here" text when no content (DRAWN ON TOP)
    if (detectedCorners && !contentImage) {
        console.log('🎯 Drawing INSERT YOUR AD HERE overlay');
        ctx.save();

        // Calculate dimensions
        const width = detectedCorners.topRight.x - detectedCorners.topLeft.x;
        const height = detectedCorners.bottomLeft.y - detectedCorners.topLeft.y;
        
        // Calculate TRUE center by averaging all four corners (works better for tilted rectangles)
        const centerX = (detectedCorners.topLeft.x + detectedCorners.topRight.x + detectedCorners.bottomLeft.x + detectedCorners.bottomRight.x) / 4;
        const centerY = (detectedCorners.topLeft.y + detectedCorners.topRight.y + detectedCorners.bottomLeft.y + detectedCorners.bottomRight.y) / 4;

        // Calculate tilt angle
        const bl = detectedCorners.bottomLeft;
        const br = detectedCorners.bottomRight;
        const bottomDeltaX = br.x - bl.x;
        const bottomDeltaY = br.y - bl.y;
        const bottomAngleRad = Math.atan2(bottomDeltaY, bottomDeltaX);
        const bottomAngleDeg = bottomAngleRad * 180 / Math.PI;
        let tiltAngle = Math.abs(bottomAngleDeg);
        if (tiltAngle > 90) tiltAngle = 180 - tiltAngle;

        console.log('📐 Drawing overlay at:', { width, height, centerX, centerY, tiltAngle });

        // Fill transparent region with semi-transparent purple overlay
        ctx.fillStyle = 'rgba(102, 126, 234, 0.15)';
        ctx.beginPath();
        ctx.moveTo(detectedCorners.topLeft.x, detectedCorners.topLeft.y);
        ctx.lineTo(detectedCorners.topRight.x, detectedCorners.topRight.y);
        ctx.lineTo(detectedCorners.bottomRight.x, detectedCorners.bottomRight.y);
        ctx.lineTo(detectedCorners.bottomLeft.x, detectedCorners.bottomLeft.y);
        ctx.closePath();
        ctx.fill();

        // Draw dashed border
        ctx.setLineDash([15, 10]);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(detectedCorners.topLeft.x, detectedCorners.topLeft.y);
        ctx.lineTo(detectedCorners.topRight.x, detectedCorners.topRight.y);
        ctx.lineTo(detectedCorners.bottomRight.x, detectedCorners.bottomRight.y);
        ctx.lineTo(detectedCorners.bottomLeft.x, detectedCorners.bottomLeft.y);
        ctx.closePath();
        ctx.stroke();

        // Calculate font sizes
        const fontSize = Math.max(Math.min(width / 12, height / 6, 60), 20);
        const dimFontSize = Math.max(fontSize * 0.5, 14);
        const instructFontSize = Math.max(dimFontSize * 0.75, 12);

        console.log('📝 Font sizes:', { fontSize, dimFontSize, instructFontSize });

        // ROTATE THE TEXT TO MATCH THE TILT ANGLE
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(bottomAngleRad); // Rotate by the calculated angle
        
        // Draw text with shadow (now rotated)
        ctx.setLineDash([]);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = '#ffffff';
        ctx.fillText('INSERT YOUR STRATEGY HERE', 0, -fontSize * 0.7); // Relative to center

        ctx.font = `600 ${dimFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
        ctx.fillStyle = '#ffffff';
        const dimensionText = `${Math.round(width)} × ${Math.round(height)} pixels`;
        ctx.fillText(dimensionText, 0, fontSize * 0.1); // Relative to center

        if (Math.abs(tiltAngle) > 0.5) {
            const tiltFontSize = Math.max(dimFontSize * 0.8, 12);
            ctx.font = `500 ${tiltFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
            ctx.fillStyle = '#ffffff';
            // ctx.fillText(`(tilted ${tiltAngle.toFixed(1)}°)`, 0, fontSize * 0.7); // Relative to center
        }

        ctx.shadowBlur = 10;
        ctx.font = `500 ${instructFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Click or paste (Ctrl+V) to add content', 0, fontSize * 1.3); // Relative to center

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.restore(); // Restore rotation

        ctx.restore();
        console.log('✅ Overlay drawing completed');

        // ============================================
        // DEBUG VISUALIZATION
        // Show technical lines when debug mode is ON
        // ============================================
        if (debugMode) {
            console.log('🔧 Drawing debug visualization');
            ctx.save();

            // Vertical center line (BLUE)
            ctx.setLineDash([]);
            ctx.strokeStyle = 'rgba(0, 0, 255, 0.9)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(centerX, detectedCorners.topLeft.y - 50);
            ctx.lineTo(centerX, detectedCorners.bottomLeft.y + 50);
            ctx.stroke();

            // Horizontal center line (CYAN) - NEW!
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.9)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(detectedCorners.topLeft.x - 50, centerY);
            ctx.lineTo(detectedCorners.topRight.x + 50, centerY);
            ctx.stroke();

            // Bottom edge line (GREEN)
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.9)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(bl.x, bl.y);
            ctx.lineTo(br.x, br.y);
            ctx.stroke();

            // Angle arc (ORANGE)
            ctx.strokeStyle = 'rgba(255,165,0,0.9)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            const arcRadius = 60;
            const verticalAngle = -Math.PI / 2;
            ctx.arc(centerX, centerY, arcRadius, verticalAngle, bottomAngleRad, bottomAngleRad > verticalAngle);
            ctx.stroke();

            // Angle label
            ctx.fillStyle = 'orange';
            ctx.font = 'bold 20px Arial';
            ctx.fillText(`${tiltAngle.toFixed(1)}°`, (bl.x + br.x) / 2 + 20, (bl.y + br.y) / 2 - 10);

            // Center point marker (BLUE DOT) - LARGER for better visibility
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
            ctx.fill();
            
            // White outline on center dot for contrast
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.restore();
            console.log('✅ Debug visualization drawn - Center point at:', centerX, centerY);
        }

        // Update dimension display
        // dimensionDisplay.style.display = 'block';
        // dimensionDisplay.innerHTML = `
        //     <strong>📐 Ad Space Detected</strong><br>
        //     <div style="font-size: 16px; color: #667eea; margin-top: 8px; font-weight: 600;">
        //         ${Math.round(width)} × ${Math.round(height)} pixels
        //         ${Math.abs(tiltAngle) > 0.5 ? ` • Tilted ${tiltAngle.toFixed(1)}°` : ''}
        //     </div>
        //     <div style="font-size: 13px; color: #666; margin-top: 5px;">
        //         Your content will automatically fit this area with perspective correction
        //     </div>
        // `;
    }
}

// Detect Transparent Area
function detectTransparentArea(img) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    let pixels = [];

    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            const index = (y * img.width + x) * 4;
            if (data[index + 3] === 0) {
                pixels.push({ x, y });
            }
        }
    }

    if (pixels.length === 0) {
        console.log("No transparent region detected.");
        return null;
    }

    const topLeft = pixels.reduce((p, c) => (c.x + c.y < p.x + p.y ? c : p));
    const topRight = pixels.reduce((p, c) => (c.x - c.y > p.x - p.y ? c : p));
    const bottomLeft = pixels.reduce((p, c) => (c.y - c.x > p.y - p.x ? c : p));
    const bottomRight = pixels.reduce((p, c) => (c.x + c.y > p.x + p.y ? c : p));

    console.log("=== TRANSPARENCY DETECTION ===");
    console.log("Total transparent pixels:", pixels.length);
    console.log("Corners:", { topLeft, topRight, bottomRight, bottomLeft });
    console.log("==============================");

    return { topLeft, topRight, bottomRight, bottomLeft };
}

// Event Listeners
function setupEventListeners() {
    audienceFilter.addEventListener('change', () => {
        updateLocationFilter();
        renderAllMockups();
    });

    locationFilter.addEventListener('change', () => {
        selectedLocation = locationFilter.value || null;
        renderAllMockups();
    });

    resetFilters.addEventListener('click', () => {
        audienceFilter.value = '';
        locationFilter.value = '';
        selectedAudience = null;
        selectedLocation = null;
        updateLocationFilter();
        renderAllMockups();
    });

    backBtn.addEventListener('click', goBackToMockups);
    canvasContainer.addEventListener('click', () => {
        if (mockupImage) contentInput.click();
    });
    contentInput.addEventListener('change', handleContentUpload);
    document.addEventListener('paste', handlePaste);
    downloadBtn.addEventListener('click', downloadResult);
    resetBtn.addEventListener('click', resetContent);
    
    // Debug toggle
    if (debugToggle) {
        console.log('✅ Debug toggle button found, adding listener');
        debugToggle.addEventListener('click', toggleDebugMode);
    } else {
        console.error('❌ Debug toggle button not found!');
    }
}

// Toggle Debug Mode
function toggleDebugMode() {
    console.log('🔧 Toggle debug mode clicked, current state:', debugMode);
    debugMode = !debugMode;
    console.log('🔧 New debug mode state:', debugMode);
    
    debugToggle.textContent = debugMode ? '🔧 Debug Mode: ON' : '🔧 Debug Mode: OFF';
    debugToggle.classList.toggle('active', debugMode);
    
    // Redraw to show/hide debug lines
    if (mockupImage) {
        console.log('🎨 Redrawing mockup with debug mode:', debugMode);
        drawMockup();
    } else {
        console.warn('⚠️  No mockup image to redraw');
    }
    
    showStatus(debugMode ? 'Debug mode enabled - showing detection lines' : 'Debug mode disabled', 'success');
}

// Go Back to Mockups
function goBackToMockups() {
    mockupSection.style.display = 'block';
    compactNav.style.display = 'flex';
    workspace.classList.remove('active');
    
    selectedMockup = null;
    mockupImage = null;
    contentImage = null;
    detectedCorners = null;
    detectedDimensions = null;
    detectedAngle = 0;

    contentInput.value = '';
    downloadBtn.disabled = true;
    dimensionDisplay.style.display = 'none';

    const ctx = resultCanvas.getContext('2d');
    ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

    showStatus('Browse mockups or use filters to narrow down', 'success');
}

// Handle Content Upload
function handleContentUpload(e) {
    const file = e.target.files[0];
    if (file) loadContentImage(file);
}

// Handle Paste
function handlePaste(e) {
    if (!workspace.classList.contains('active')) return;
    e.preventDefault();

    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
                showStatus('Pasting content...', 'processing');
                loadContentImage(blob);
            }
            break;
        }
    }
}

// Load Content Image
// Load Content Image with AI Animation
// Load Content Image with Confined Animation
// Load Content Image with Confined Animation
function loadContentImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // Show status banner
            const banner = document.getElementById('aiStatusBanner');
            banner.classList.add('active');
            
            // Show processing overlay
            const overlay = document.getElementById('processingOverlay');
            overlay.classList.add('active');
            
            // Create glow effect within detected region
            if (detectedCorners) {
                createProcessingGlow();
            }
            
            // Create sparkles within transparent region
            const sparkleInterval = setInterval(() => {
                if (detectedCorners) {
                    createConfinedSparkle();
                }
            }, 100); // More frequent sparkles for better effect
            
            // Simulate AI processing
            showStatus('AI is analyzing and fitting your content...', 'processing');
            
            setTimeout(() => {
                // Stop sparkles
                clearInterval(sparkleInterval);
                
                // Set the content image
                contentImage = img;
                
                // Gradual reveal with progressive rendering
                let progress = 0;
                const revealInterval = setInterval(() => {
                    progress += 3;
                    
                    if (progress <= 100) {
                        // Draw with increasing opacity
                        drawMockupWithProgress(progress / 100);
                        
                        // Continue sparkles during reveal (less frequent)
                        if (Math.random() > 0.8 && detectedCorners) {
                            createConfinedSparkle();
                        }
                    } else {
                        clearInterval(revealInterval);
                        
                        // Hide overlay and banner
                        overlay.classList.remove('active');
                        banner.classList.remove('active');
                        
                        // Remove glow effect
                        const glowArea = document.querySelector('.processing-glow-area');
                        if (glowArea) glowArea.remove();
                        
                        // Final draw
                        contentImage = img;
                        drawMockup();
                        downloadBtn.disabled = false;
                        showStatus(`Content added! (${img.width}×${img.height}px). Click download when ready.`, 'success');
                        
                        // Clean up sparkles
                        document.querySelectorAll('.sparkle').forEach(s => s.remove());
                    }
                }, 40);
            }, 2500); // 2.5 second AI processing
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Create sparkle confined to transparent region
// Create sparkle confined to transparent region
function createConfinedSparkle() {
    if (!detectedCorners) return;
    
    const overlay = document.getElementById('processingOverlay');
    if (!overlay) return;
    
    // Get random point within the quadrilateral
    const point = getRandomPointInQuad(detectedCorners);
    
    // Array of sparkle symbols
    const symbols = ['✦', '✧', '✨', '⭐', '★', '◆', '◇', '●', '○', '◉', '⬟', '⬢', '⬡'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Random size
    const sizes = ['small', 'medium', 'large'];
    const weights = [0.5, 0.35, 0.15]; // More small, fewer large
    const randomSize = sizes[weightedRandom(weights)];
    
    const sparkle = document.createElement('div');
    sparkle.className = `sparkle ${randomSize}`;
    sparkle.textContent = randomSymbol;
    sparkle.style.left = point.x + 'px';
    sparkle.style.top = point.y + 'px';
    
    // Random color variation
    const colors = [
        '#667eea',
        '#764ba2', 
        '#5568d3',
        '#7c6ceb',
        '#8b7de8'
    ];
    sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    overlay.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1500);
}

// Weighted random selection
function weightedRandom(weights) {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < weights.length; i++) {
        if (random < weights[i]) return i;
        random -= weights[i];
    }
    return weights.length - 1;
}

// Get random point inside the quadrilateral (transparent region)
function getRandomPointInQuad(corners) {
    // Use bilinear interpolation to get point inside quad
    const s = Math.random();
    const t = Math.random();
    
    // Interpolate between corners
    const top = {
        x: corners.topLeft.x + s * (corners.topRight.x - corners.topLeft.x),
        y: corners.topLeft.y + s * (corners.topRight.y - corners.topLeft.y)
    };
    
    const bottom = {
        x: corners.bottomLeft.x + s * (corners.bottomRight.x - corners.bottomLeft.x),
        y: corners.bottomLeft.y + s * (corners.bottomRight.y - corners.bottomLeft.y)
    };
    
    return {
        x: top.x + t * (bottom.x - top.x),
        y: top.y + t * (bottom.y - top.y)
    };
}

// Create processing glow area
function createProcessingGlow() {
    if (!detectedCorners) return;
    
    const overlay = document.getElementById('processingOverlay');
    const glowArea = document.createElement('div');
    glowArea.className = 'processing-glow-area';
    
    // Calculate bounding box of the quad
    const minX = Math.min(detectedCorners.topLeft.x, detectedCorners.bottomLeft.x);
    const maxX = Math.max(detectedCorners.topRight.x, detectedCorners.bottomRight.x);
    const minY = Math.min(detectedCorners.topLeft.y, detectedCorners.topRight.y);
    const maxY = Math.max(detectedCorners.bottomLeft.y, detectedCorners.bottomRight.y);
    
    glowArea.style.left = minX + 'px';
    glowArea.style.top = minY + 'px';
    glowArea.style.width = (maxX - minX) + 'px';
    glowArea.style.height = (maxY - minY) + 'px';
    
    // Create clip path for the exact quad shape
    const clipPath = `polygon(
        ${detectedCorners.topLeft.x - minX}px ${detectedCorners.topLeft.y - minY}px,
        ${detectedCorners.topRight.x - minX}px ${detectedCorners.topRight.y - minY}px,
        ${detectedCorners.bottomRight.x - minX}px ${detectedCorners.bottomRight.y - minY}px,
        ${detectedCorners.bottomLeft.x - minX}px ${detectedCorners.bottomLeft.y - minY}px
    )`;
    glowArea.style.clipPath = clipPath;
    
    overlay.appendChild(glowArea);
}

// Draw mockup with progressive opacity (for smooth reveal)
function drawMockupWithProgress(opacity) {
    if (!mockupImage || !contentImage || !detectedCorners) return;
    
    resultCanvas.width = mockupImage.width;
    resultCanvas.height = mockupImage.height;
    const ctx = resultCanvas.getContext('2d');
    
    ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    
    // Draw content with perspective transform and opacity
    ctx.save();
    ctx.globalAlpha = opacity;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = contentImage.width;
    tempCanvas.height = contentImage.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(contentImage, 0, 0);
    
    const src = cv.imread(tempCanvas);
    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0,
        contentImage.width, 0,
        contentImage.width, contentImage.height,
        0, contentImage.height
    ]);
    
    const corners = detectedCorners;
    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
        corners.topLeft.x, corners.topLeft.y,
        corners.topRight.x, corners.topRight.y,
        corners.bottomRight.x, corners.bottomRight.y,
        corners.bottomLeft.x, corners.bottomLeft.y
    ]);
    
    const M = cv.getPerspectiveTransform(srcTri, dstTri);
    const warped = new cv.Mat();
    cv.warpPerspective(
        src,
        warped,
        M,
        new cv.Size(mockupImage.width, mockupImage.height),
        cv.INTER_AREA,
        cv.BORDER_CONSTANT,
        new cv.Scalar(0, 0, 0, 0)
    );
    
    const imgData = new ImageData(
        new Uint8ClampedArray(warped.data),
        warped.cols,
        warped.rows
    );
    ctx.putImageData(imgData, 0, 0);
    
    src.delete();
    warped.delete();
    srcTri.delete();
    dstTri.delete();
    M.delete();
    
    ctx.restore();
    
    // Draw mockup frame on top
    ctx.drawImage(mockupImage, 0, 0);
}

// Download Result
function downloadResult() {
    const link = document.createElement('a');
    link.download = `${selectedMockup.name.replace(/\s+/g, '-').toLowerCase()}-mockup.png`;
    link.href = resultCanvas.toDataURL('image/png');
    link.click();
    showStatus('Mockup downloaded!', 'success');
}

// Reset Content
function resetContent() {
    contentImage = null;
    contentInput.value = '';
    drawMockup();
    downloadBtn.disabled = true;
    showStatus('Content cleared. Paste or click to add new content.', 'success');
}

// Show Status
function showStatus(message, type) {
    status.innerHTML = message;
    status.className = `status ${type}`;
    status.display = 'block';

    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }
}

// Initialize on page load
window.addEventListener('load', () => {
    if (typeof cv === 'undefined') {
        console.error('OpenCV.js not loaded yet. Waiting...');
        setTimeout(init, 1000);
    } else {
        cv['onRuntimeInitialized'] = () => {
            console.log('✅ OpenCV ready');
            init();
        };
    }
});