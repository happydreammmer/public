// ===== EVENT DATA =====
const events = [
    // == EUROPE ==
    { name: "ITB Berlin", country: "germany", countryFlag: "🇩🇪", city: "Berlin", date: "2025-03-04", endDate: "2025-03-06", category: "tourism", description: "A leading global trade fair for the tourism industry, connecting professionals from around the world." },
    { name: "BAUMA", country: "germany", countryFlag: "🇩🇪", city: "Munich", date: "2025-04-07", endDate: "2025-04-13", category: "construction", description: "The world's leading trade fair for construction machinery and building material machines." },
    { name: "KubeCon + CloudNativeCon Europe", country: "france", countryFlag: "🇫🇷", city: "Paris", date: "2025-03-25", endDate: "2025-03-28", category: "technology", description: "The flagship conference of the Cloud Native Computing Foundation for cloud native communities." },
    { name: "The Next Web Conference", country: "netherlands", countryFlag: "🇳🇱", city: "Amsterdam", date: "2025-06-19", endDate: "2025-06-20", category: "technology", description: "A vibrant technology festival that brings together international technology executives, top-tier investors, and promising startups." },
    { name: "MIPCOM", country: "france", countryFlag: "🇫🇷", city: "Cannes", date: "2025-10-13", endDate: "2025-10-16", category: "entertainment", description: "The world's leading entertainment content market, gathering television industry professionals." },
    { name: "BAU", country: "germany", countryFlag: "🇩🇪", city: "Munich", date: "2025-01-13", endDate: "2025-01-18", category: "construction", description: "The world's leading trade fair for architecture, materials, and systems." },
    { name: "MIPIM", country: "france", countryFlag: "🇫🇷", city: "Cannes", date: "2025-03-11", endDate: "2025-03-14", category: "construction", description: "A premier international event for the real estate and property market." },
    { name: "Anuga", country: "germany", countryFlag: "🇩🇪", city: "Cologne", date: "2025-10-04", endDate: "2025-10-08", category: "food", description: "The world's leading trade fair for food and beverages, showcasing the latest industry trends." },
    { name: "World Retail Congress", country: "france", countryFlag: "🇫🇷", city: "Paris", date: "2025-04-29", endDate: "2025-05-01", category: "finance", description: "An essential event for retail leaders from around the globe to connect and share insights." },
    { name: "Cannes Lions International Festival of Creativity", country: "france", countryFlag: "🇫🇷", city: "Cannes", date: "2025-06-16", endDate: "2025-06-20", category: "entertainment", description: "A global event for those working in creative communications, advertising, and related fields." },
    { name: "Frankfurt Book Fair", country: "germany", countryFlag: "🇩🇪", city: "Frankfurt", date: "2025-10-15", endDate: "2025-10-19", category: "entertainment", description: "The world's largest trade fair for books, based on the number of publishing companies represented." },
    { name: "Agritechnica", country: "germany", countryFlag: "🇩🇪", city: "Hanover", date: "2025-11-09", endDate: "2025-11-15", category: "food", description: "The world's leading trade fair for agricultural technology and machinery." },
    { name: "Intersolar Europe", country: "germany", countryFlag: "🇩🇪", city: "Munich", date: "2025-06-18", endDate: "2025-06-20", category: "energy", description: "The world's leading exhibition for the solar industry and its partners." },
    { name: "World Economic Forum Annual Meeting", country: "switzerland", countryFlag: "🇨🇭", city: "Davos", date: "2025-01-20", endDate: "2025-01-24", category: "finance", description: "The world's foremost gathering of political, business, and cultural leaders to shape global, regional, and industry agendas." },
    { name: "FITUR 2025", country: "spain", countryFlag: "🇪🇸", city: "Madrid", date: "2025-01-22", endDate: "2025-01-26", category: "tourism", description: "One of the leading global trade fairs for the tourism industry, bringing together professionals from around the world to define travel trends." },
    { name: "MWC Barcelona 2025", country: "spain", countryFlag: "🇪🇸", city: "Barcelona", date: "2025-03-03", endDate: "2025-03-06", category: "technology", description: "The world's largest and most influential exhibition for the connectivity and mobile industry, with over 2,400 exhibitors and 88,000 attendees." },
    { name: "Hannover Messe", country: "germany", countryFlag: "🇩🇪", city: "Hanover", date: "2025-03-31", endDate: "2025-04-04", category: "technology", description: "The world's leading trade fair for industrial technology, covering automation, energy solutions, and engineered parts with a focus on AI and sustainability." },
    { name: "WindEurope Annual Event", country: "denmark", countryFlag: "🇩🇰", city: "Copenhagen", date: "2025-04-01", endDate: "2025-04-03", category: "energy", description: "Europe's premier annual wind energy conference and exhibition, bringing together thousands of industry experts, policymakers, and business leaders." },
    { name: "Salone del Mobile.Milano", country: "italy", countryFlag: "🇮🇹", city: "Milan", date: "2025-04-08", endDate: "2025-04-13", category: "fashion", description: "The premier global event for the furniture and design industry, showcasing the latest innovations and trends from thousands of brands." },
    { name: "Reflect Festival 2025", country: "cyprus", countryFlag: "🇨🇾", city: "Limassol", date: "2025-05-15", endDate: "2025-05-16", category: "technology", description: "The largest technology and startup event in Cyprus, connecting innovators from Europe, Africa, and the Middle East." },
    { name: "Viva Technology", country: "france", countryFlag: "🇫🇷", city: "Paris", date: "2025-06-11", endDate: "2025-06-14", category: "technology", description: "Europe's biggest startup and tech event, gathering over 150,000 attendees to celebrate innovation and explore future technologies." },
    { name: "Paris Air Show", country: "france", countryFlag: "🇫🇷", city: "Paris", date: "2025-06-16", endDate: "2025-06-22", category: "technology", description: "The largest and longest-running aerospace trade show in the world, bringing together key players in the global aerospace and defense industry." },
    { name: "London Tech Week", country: "unitedkingdom", countryFlag: "🇬🇧", city: "London", date: "2025-06-16", endDate: "2025-06-20", category: "technology", description: "A flagship tech festival gathering the world's most inspirational founders, global leaders, and senior investors to discuss the future of technology." },
    { name: "Gamescom 2025", country: "germany", countryFlag: "🇩🇪", city: "Cologne", date: "2025-08-20", endDate: "2025-08-24", category: "entertainment", description: "The world's largest trade fair for video games, bringing together developers, publishers, and hundreds of thousands of gamers." },
    { name: "IFA Berlin 2025", country: "germany", countryFlag: "🇩🇪", city: "Berlin", date: "2025-09-05", endDate: "2025-09-09", category: "technology", description: "One of the world's leading trade shows for consumer electronics and home appliances, showcasing the latest products and innovations." },
    { name: "Web Summit 2025", country: "portugal", countryFlag: "🇵🇹", city: "Lisbon", date: "2025-11-03", endDate: "2025-11-06", category: "technology", description: "One of the largest and most important tech conferences in the world, gathering over 70,000 people to redefine the tech industry." },
    { name: "Medica 2025", country: "germany", countryFlag: "🇩🇪", city: "Düsseldorf", date: "2025-11-17", endDate: "2025-11-20", category: "healthcare", description: "The world's largest and most international event for the medical technology and healthcare industry, attracting tens of thousands of professionals." },
    { name: "Slush 2025", country: "finland", countryFlag: "🇫🇮", city: "Helsinki", date: "2025-11-20", endDate: "2025-11-21", category: "technology", description: "A leading startup and tech event, known for its focus on connecting founders with investors in a high-energy, matchmaking environment." },
    { name: "SAP Sapphire Madrid", country: "spain", countryFlag: "🇪🇸", city: "Madrid", date: "2025-05-26", endDate: "2025-05-28", category: "technology", description: "SAP's flagship European conference showcasing innovations in ERP, AI, and business technology for the EMEA market." },
    { name: "Gartner IT Symposium/Xpo Barcelona", country: "spain", countryFlag: "🇪🇸", city: "Barcelona", date: "2025-11-10", endDate: "2025-11-13", category: "technology", description: "Europe's premier gathering for CIOs and IT leaders, focusing on technology trends, leadership, and business strategy." },
    { name: "DMEXCO", country: "germany", countryFlag: "🇩🇪", city: "Cologne", date: "2025-09-17", endDate: "2025-09-18", category: "marketing", description: "Europe's leading digital marketing and tech event, bringing together industry leaders, marketing professionals, and technology pioneers. Dates TBC for Sep 2025." },
    { name: "Money 20/20 Europe", country: "netherlands", countryFlag: "🇳🇱", city: "Amsterdam", date: "2025-06-03", endDate: "2025-06-05", category: "finance", description: "One of the world's leading fintech events, where the entire financial services industry connects to create the future of money." },
    { name: "Shoptalk Europe", country: "spain", countryFlag: "🇪🇸", city: "Barcelona", date: "2025-06-09", endDate: "2025-06-11", category: "finance", description: "The European edition of Shoptalk, gathering retail and e-commerce leaders to discuss the future of commerce in the region. Dates TBC." },
    { name: "LogiMat", country: "germany", countryFlag: "🇩🇪", city: "Stuttgart", date: "2025-03-11", endDate: "2025-03-13", category: "supply_chain", description: "The international trade show for intralogistics solutions and process management, setting new standards in the industry." },
    { name: "CIPD Festival of Work", country: "unitedkingdom", countryFlag: "🇬🇧", city: "London", date: "2025-06-11", endDate: "2025-06-12", category: "hr", description: "A major UK event for people professionals, exploring the future of work, HR, and learning and development. Dates TBC for June 2025." },
    { name: "MAD//Fest London", country: "unitedkingdom", countryFlag: "🇬🇧", city: "London", date: "2025-07-01", endDate: "2025-07-03", category: "marketing", description: "The UK's largest marketing, advertising and disruption festival, known for its vibrant atmosphere and focus on innovation." },
    
    // == AMERICAS ==
    { name: "NAB Show", country: "usa", countryFlag: "🇺🇸", city: "Las Vegas", date: "2025-04-06", endDate: "2025-04-09", category: "entertainment", description: "The ultimate event for the media, entertainment and technology industry." },
    { name: "Greenbuild International Conference & Expo", country: "usa", countryFlag: "🇺🇸", city: "San Diego", date: "2025-11-12", endDate: "2025-11-14", category: "construction", description: "The premier event for the green building industry, showcasing sustainable building practices." },
    { name: "SXSW (South by Southwest)", country: "usa", countryFlag: "🇺🇸", city: "Austin", date: "2025-03-07", endDate: "2025-03-15", category: "entertainment", description: "An essential destination for global professionals, featuring sessions, showcases, and a variety of networking opportunities." },
    { name: "World of Concrete", country: "usa", countryFlag: "🇺🇸", city: "Las Vegas", date: "2025-01-20", endDate: "2025-01-23", category: "construction", description: "The industry's only annual international event dedicated to the commercial concrete and masonry construction industries." },
    { name: "NVIDIA GTC", country: "usa", countryFlag: "🇺🇸", city: "San Jose", date: "2025-03-17", endDate: "2025-03-21", category: "technology", description: "The premier AI conference for developers, researchers, and innovators from around the world." },
    { name: "World Agri-Tech South America Summit", country: "brazil", countryFlag: "🇧🇷", city: "São Paulo", date: "2025-06-24", endDate: "2025-06-25", category: "food", description: "A major summit for the food and agriculture technology sector in South America." },
    { name: "IMEX America", country: "usa", countryFlag: "🇺🇸", city: "Las Vegas", date: "2025-10-07", endDate: "2025-10-09", category: "tourism", description: "The largest trade show in the US for the global meetings, events and incentive travel industry." },
    { name: "ASU+GSV Summit", country: "usa", countryFlag: "🇺🇸", city: "San Diego", date: "2025-04-14", endDate: "2025-04-16", category: "education", description: "A key event connecting leading minds in digital learning and workforce skills." },
    { name: "Future of Education Technology Conference (FETC)", country: "usa", countryFlag: "🇺🇸", city: "Orlando", date: "2025-01-27", endDate: "2025-01-30", category: "education", description: "An intensive, highly collaborative exploration of new technologies, best practices and pressing issues in education." },
    { name: "COP30", country: "brazil", countryFlag: "🇧🇷", city: "Belém", date: "2025-11-10", endDate: "2025-11-21", category: "energy", description: "The 30th Conference of the Parties to the UNFCCC, a crucial global climate summit." },
    { name: "Rio Carnival", country: "brazil", countryFlag: "🇧🇷", city: "Rio de Janeiro", date: "2025-02-28", endDate: "2025-03-04", category: "entertainment", description: "One of the most famous festivals in the world, known for its spectacular parades and vibrant atmosphere." },
    { name: "HIMSS Global Health Conference & Exhibition", country: "usa", countryFlag: "🇺🇸", city: "Chicago", date: "2025-04-14", endDate: "2025-04-18", category: "healthcare", description: "A leading health information and technology conference, bringing together professionals from around the world." },
    { name: "CES 2025", country: "usa", countryFlag: "🇺🇸", city: "Las Vegas", date: "2025-01-07", endDate: "2025-01-10", category: "technology", description: "The world's most influential technology event, showcasing groundbreaking innovations in AI, automotive tech, consumer electronics, and more from over 4,000 exhibitors." },
    { name: "NRF 2025: Retail's Big Show", country: "usa", countryFlag: "🇺🇸", city: "New York City", date: "2025-01-12", endDate: "2025-01-14", category: "finance", description: "The largest retail conference and expo, bringing together 40,000+ industry leaders to discuss the future of retail, e-commerce, and supply chain." },
    { name: "PDAC 2025 Convention", country: "canada", countryFlag: "🇨🇦", city: "Toronto", date: "2025-03-02", endDate: "2025-03-05", category: "energy", description: "The world's premier mineral exploration and mining convention, attracting over 30,000 attendees from 130+ countries for networking and investment." },
    { name: "Colombia Family Office & Investors Summit 2025", country: "colombia", countryFlag: "🇨🇴", city: "Bogotá", date: "2025-04-01", endDate: "2025-04-02", category: "finance", description: "An exclusive event for single and multi-family offices, investors, and business families to share best practices and explore investment opportunities." },
    { name: "Feicon", country: "brazil", countryFlag: "🇧🇷", city: "São Paulo", date: "2025-04-08", endDate: "2025-04-11", category: "construction", description: "The largest construction and architecture event in Latin America, showcasing trends in finishes, structures, and building systems." },
    { name: "Expomin 2025", country: "chile", countryFlag: "🇨🇱", city: "Santiago", date: "2025-04-22", endDate: "2025-04-25", category: "energy", description: "The largest mining fair in Latin America, promoting the transfer of knowledge and technologies to increase productivity in mining processes." },
    { name: "RSA Conference 2025", country: "usa", countryFlag: "🇺🇸", city: "San Francisco", date: "2025-05-05", endDate: "2025-05-08", category: "technology", description: "The premier global cybersecurity conference, gathering professionals to discuss the latest trends, threats, and advancements in information security." },
    { name: "The Electric Mine 2025", country: "chile", countryFlag: "🇨🇱", city: "Santiago", date: "2025-05-13", endDate: "2025-05-15", category: "energy", description: "Premier event dedicated to the electrification of mining, focusing on decarbonization and advancements in underground and surface mining technology." },
    { name: "FENAGRA 2025", country: "brazil", countryFlag: "🇧🇷", city: "São Paulo", date: "2025-05-13", endDate: "2025-05-15", category: "food", description: "A leading international agribusiness fair focused on animal rendering, pet food, and the vegetable oils and fats industry." },
    { name: "Global Energy Show Canada", country: "canada", countryFlag: "🇨🇦", city: "Calgary", date: "2025-06-10", endDate: "2025-06-12", category: "energy", description: "North America's leading energy event, showcasing a comprehensive exhibition and conference on all aspects of the energy system, including oil and gas and renewables." },
    { name: "HTAi 2025 Annual Meeting", country: "argentina", countryFlag: "🇦🇷", city: "Buenos Aires", date: "2025-06-14", endDate: "2025-06-18", category: "healthcare", description: "A major global meeting for leaders in Health Technology Assessment (HTA) to discuss evidence-based healthcare decision-making and innovation." },
    { name: "BIO International Convention 2025", country: "usa", countryFlag: "🇺🇸", city: "Philadelphia", date: "2025-06-16", endDate: "2025-06-19", category: "healthcare", description: "The world's largest biotechnology event, uniting 20,000+ leaders from across the globe for networking, programming, and partnership opportunities." },
    { name: "Collision Conference 2025", country: "canada", countryFlag: "🇨🇦", city: "Toronto", date: "2025-06-23", endDate: "2025-06-26", category: "technology", description: "One of North America's fastest-growing tech conferences, known as 'the Olympics of tech,' attracting startups, investors, and media from around the world." },
    { name: "Salesforce Dreamforce 2025", country: "usa", countryFlag: "🇺🇸", city: "San Francisco", date: "2025-09-16", endDate: "2025-09-18", category: "technology", description: "A massive technology conference focused on AI, CRM, and data, bringing together the global Salesforce community for learning and innovation." },
    { name: "Expoalimentaria 2025", country: "peru", countryFlag: "🇵🇪", city: "Lima", date: "2025-09-24", endDate: "2025-09-26", category: "food", description: "The largest international trade show in Latin America for food and beverages, connecting producers with global buyers." },
    { name: "FINNOSUMMIT", country: "mexico", countryFlag: "🇲🇽", city: "Mexico City", date: "2025-09-25", endDate: "2025-09-26", category: "finance", description: "A leading conference connecting innovators in the fintech and insurtech industries across Latin America, with a focus on collaboration and innovation." },
    { name: "Expo CIHAC 2025", country: "mexico", countryFlag: "🇲🇽", city: "Mexico City", date: "2025-10-08", endDate: "2025-10-10", category: "construction", description: "The leading event for the construction, engineering, and architecture industry in Mexico and Latin America, connecting suppliers with major projects." },
    { name: "Ekoparty Security Conference 2025", country: "argentina", countryFlag: "🇦🇷", city: "Buenos Aires", date: "2025-10-01", endDate: "2025-10-01", category: "technology", description: "One of South America's most important cybersecurity conferences, featuring cutting-edge research and technical talks from global experts. Dates are TBC." },
    
    
    // == ADDITIONAL MIDDLE EAST EVENTS ==
    
    // Qatar
    { name: "Finnovex Qatar 2025", country: "qatar", countryFlag: "🇶🇦", city: "Doha", date: "2025-06-24", endDate: "2025-06-24", category: "finance", description: "Leading fintech and financial services innovation conference in Qatar, bringing together industry leaders and innovators.", url: "https://qa.finnovex.com/" },
    { name: "Qatar Leadership Summit", country: "qatar", countryFlag: "🇶🇦", city: "Doha", date: "2025-07-29", endDate: "2025-07-31", category: "education", description: "Premier leadership development summit focusing on strategic management and organizational excellence in the Middle East.", url: "https://mbsedu.co.uk/qatar-leadership" },
    { name: "Second World Summit for Social Development (WSSD)", country: "qatar", countryFlag: "🇶🇦", city: "Doha", date: "2025-11-04", endDate: "2025-11-06", category: "finance", description: "Global summit addressing social development challenges and sustainable development goals, hosted by the UN.", url: "https://www.un.org/development/desa/dspd/2025/02/second-world-summit-for-social-development-2025.html" },
    
    // UAE
    { name: "AIM Investment Summit 2025", country: "uae", countryFlag: "🇦🇪", city: "Dubai", date: "2025-04-07", endDate: "2025-04-09", category: "finance", description: "Annual Investment Meeting bringing together global investors, governments, and institutions to discuss future investment opportunities.", url: "https://aimcongress.com/" },
    { name: "World Local Production Forum", country: "uae", countryFlag: "🇦🇪", city: "Dubai", date: "2025-04-07", endDate: "2025-04-09", category: "supply_chain", description: "Global forum focusing on local production strategies, supply chain resilience, and manufacturing innovation." },
    { name: "World Crisis & Emergency Management Summit 2025", country: "uae", countryFlag: "🇦🇪", city: "Dubai", date: "2025-04-08", endDate: "2025-04-09", category: "finance", description: "International summit addressing crisis management, emergency response, and disaster preparedness strategies." },
    { name: "IFATCA 64th Annual Conference", country: "uae", countryFlag: "🇦🇪", city: "Dubai", date: "2025-04-28", endDate: "2025-05-02", category: "technology", description: "International Federation of Air Traffic Controllers' Associations annual conference focusing on aviation safety and technology.", url: "https://www.ifatca.org/" },
    { name: "Aesthetic & Anti-Aging Medicine World Congress (AMWC)", country: "uae", countryFlag: "🇦🇪", city: "Dubai", date: "2025-10-01", endDate: "2025-10-03", category: "healthcare", description: "Leading international congress for aesthetic and anti-aging medicine, featuring latest treatments and technologies.", url: "https://www.amwc-conference.com/" },
    
    // Saudi Arabia
    { name: "Finnovex Saudi Arabia", country: "saudi", countryFlag: "🇸🇦", city: "Riyadh", date: "2025-09-02", endDate: "2025-09-03", category: "finance", description: "Saudi Arabia's premier fintech and financial innovation conference supporting Vision 2030 digital transformation goals.", url: "https://sa.finnovex.com/" },
    
    // Oman
    { name: "Oman Fire, Safety & Security Summit & Expo (OFSEC)", country: "oman", countryFlag: "🇴🇲", city: "Muscat", date: "2025-10-14", endDate: "2025-10-15", category: "technology", description: "Leading summit and exhibition for fire safety, security, and emergency response solutions in the GCC region.", url: "https://www.ofsecevent.com/" },
    { name: "Warehouse Tech Oman", country: "oman", countryFlag: "🇴🇲", city: "Muscat", date: "2025-10-06", endDate: "2025-10-07", category: "supply_chain", description: "Specialized exhibition showcasing warehouse technology, logistics automation, and supply chain innovations." },
    { name: "CC-Submarine Summit Middle East", country: "oman", countryFlag: "🇴🇲", city: "Muscat", date: "2025-11-02", endDate: "2025-11-04", category: "technology", description: "Regional summit focusing on submarine communications, underwater technology, and maritime security solutions." },
    { name: "Home and Building Expo + Urban October", country: "oman", countryFlag: "🇴🇲", city: "Muscat", date: "2025-10-06", endDate: "2025-10-08", category: "construction", description: "Comprehensive exhibition for home improvement, building materials, and urban development solutions.", url: "https://omanhomeandbuilding.com/" },
    { name: "Oman Motor Show", country: "oman", countryFlag: "🇴🇲", city: "Muscat", date: "2025-10-15", endDate: "2025-10-18", category: "technology", description: "Premier automotive exhibition showcasing latest vehicles, automotive technology, and mobility solutions in Oman.", url: "https://omanmotorshow.com/" },
    
    // Kuwait
    { name: "Kuwait International Trade Fair 2025", country: "kuwait", countryFlag: "🇰🇼", city: "Kuwait City", date: "2025-03-10", endDate: "2025-03-15", category: "finance", description: "Kuwait's largest multi-sectoral trade exhibition promoting international trade and business partnerships.", url: "https://www.kitf-expo.com/" },
    { name: "Kuwait Food & Beverage Expo 2025", country: "kuwait", countryFlag: "🇰🇼", city: "Kuwait City", date: "2025-04-20", endDate: "2025-04-23", category: "food", description: "Leading food and beverage exhibition in Kuwait, showcasing regional and international culinary innovations." },
    { name: "Thought Leadership Circle: Empowering Energy Transformation", country: "kuwait", countryFlag: "🇰🇼", city: "Kuwait City", date: "2025-06-18", endDate: "2025-06-18", category: "energy", description: "High-level discussion forum on energy transformation, sustainability, and the future of oil and gas industry.", url: "https://www.thebusinessyear.com/event/thought-leadership-circle-empowering-energy-transformation/" },
    
    // Turkey
    { name: "KAPEX 2025 | International Door & Accessories Fair", country: "turkey", countryFlag: "🇹🇷", city: "Istanbul", date: "2025-09-10", endDate: "2025-09-12", category: "construction", description: "International trade fair for doors, windows, hardware, and building accessories industry." },
    
    // Jordan
    { name: "Hope and Dreams Sports Festival", country: "jordan", countryFlag: "🇯🇴", city: "Amman", date: "2025-04-30", endDate: "2025-05-03", category: "entertainment", description: "International sports festival promoting youth engagement, athletic excellence, and cultural exchange in the region." },
    { name: "Annual Areej Forum", country: "jordan", countryFlag: "🇯🇴", city: "Amman", date: "2025-12-05", endDate: "2025-12-07", category: "education", description: "Annual forum focusing on education, culture, and social development in the Arab world." },
    
    // Iraq
    { name: "Arab League Summit", country: "iraq", countryFlag: "🇮🇶", city: "Baghdad", date: "2025-05-17", endDate: "2025-05-17", category: "finance", description: "Annual summit of Arab League leaders addressing regional political, economic, and security cooperation." },
    { name: "Arab Economic and Social Development Summit", country: "iraq", countryFlag: "🇮🇶", city: "Baghdad", date: "2025-05-17", endDate: "2025-05-17", category: "finance", description: "High-level summit focusing on economic integration, social development, and sustainable growth across Arab nations." },
    
    // Egypt
    { name: "Africa FinTech Forum", country: "egypt", countryFlag: "🇪🇬", city: "Cairo", date: "2025-06-10", endDate: "2025-06-10", category: "finance", description: "Premier fintech conference for the African continent, showcasing financial technology innovations and digital payment solutions." },
    { name: "International Congress of Skeletal Deformities Correction", country: "egypt", countryFlag: "🇪🇬", city: "Cairo", date: "2025-07-23", endDate: "2025-07-23", category: "healthcare", description: "Specialized medical congress focusing on orthopedic surgery, skeletal deformity treatment, and advanced surgical techniques." },
    { name: "ITC-Egypt 2025", country: "egypt", countryFlag: "🇪🇬", city: "Cairo", date: "2025-07-28", endDate: "2025-07-31", category: "technology", description: "International Technology Conference showcasing ICT innovations, digital transformation, and emerging technologies.", url: "https://itc-egypt.org/" }
];

// ===== MAPPINGS & CONSTANTS =====
const categoryIcons = {
    technology: '💻', 
    healthcare: '🏥', 
    energy: '⚡', 
    finance: '💰', 
    tourism: '✈️',
    construction: '🏗️', 
    food: '🍽️', 
    fashion: '👗', 
    education: '📚', 
    entertainment: '🎭',
    marketing: '📈', 
    hr: '👥', 
    supply_chain: '📦'
};

const countryToContinentMap = {
    // Europe
    germany: "europe", france: "europe", netherlands: "europe", spain: "europe", 
    italy: "europe", unitedkingdom: "europe", switzerland: "europe", portugal: "europe", 
    denmark: "europe", finland: "europe", cyprus: "europe",
    
    // Americas
    usa: "americas", canada: "americas", brazil: "americas", mexico: "americas", 
    chile: "americas", argentina: "americas", colombia: "americas", peru: "americas",
    
    // Asia-Pacific
    china: "asia_pacific", japan: "asia_pacific", india: "asia_pacific", southkorea: "asia_pacific", 
    australia: "asia_pacific", newzealand: "asia_pacific", singapore: "asia_pacific", 
    hongkong: "asia_pacific", taiwan: "asia_pacific", malaysia: "asia_pacific", 
    thailand: "asia_pacific", indonesia: "asia_pacific", philippines: "asia_pacific", 
    vietnam: "asia_pacific", pakistan: "asia_pacific", bangladesh: "asia_pacific", 
    srilanka: "asia_pacific", nepal: "asia_pacific", cambodia: "asia_pacific", myanmar: "asia_pacific",
    
    // Middle East & Central Asia
    uae: "middle_east_central_asia", saudi: "middle_east_central_asia", qatar: "middle_east_central_asia", 
    turkey: "middle_east_central_asia", israel: "middle_east_central_asia", iran: "middle_east_central_asia", 
    iraq: "middle_east_central_asia", lebanon: "middle_east_central_asia", bahrain: "middle_east_central_asia", 
    jordan: "middle_east_central_asia", azerbaijan: "middle_east_central_asia", kazakhstan: "middle_east_central_asia", 
    uzbekistan: "middle_east_central_asia", turkmenistan: "middle_east_central_asia", kyrgyzstan: "middle_east_central_asia", 
    georgia: "middle_east_central_asia", armenia: "middle_east_central_asia", mongolia: "middle_east_central_asia", 
    kuwait: "middle_east_central_asia", oman: "middle_east_central_asia",
    
    // Africa
    southafrica: "africa", nigeria: "africa", egypt: "africa", kenya: "africa", 
    ghana: "africa", morocco: "africa", ethiopia: "africa", angola: "africa", 
    algeria: "africa", tunisia: "africa", rwanda: "africa", tanzania: "africa", 
    botswana: "africa", uganda: "africa", senegal: "africa", mozambique: "africa"
};

const countryDisplayNames = {
    usa: "🇺🇸 USA", canada: "🇨🇦 Canada", brazil: "🇧🇷 Brazil", argentina: "🇦🇷 Argentina", 
    chile: "🇨🇱 Chile", colombia: "🇨🇴 Colombia", mexico: "🇲🇽 Mexico", peru: "🇵🇪 Peru",
    unitedkingdom: "🇬🇧 UK", germany: "🇩🇪 Germany", france: "🇫🇷 France", spain: "🇪🇸 Spain", 
    portugal: "🇵🇹 Portugal", switzerland: "🇨🇭 Switzerland", italy: "🇮🇹 Italy", finland: "🇫🇮 Finland", 
    denmark: "🇩🇰 Denmark", cyprus: "🇨🇾 Cyprus", netherlands: "🇳🇱 Netherlands",
    uae: "🇦🇪 UAE", saudi: "🇸🇦 Saudi Arabia", qatar: "🇶🇦 Qatar", turkey: "🇹🇷 Turkey", 
    kuwait: "🇰🇼 Kuwait", oman: "🇴🇲 Oman", bahrain: "🇧🇭 Bahrain", jordan: "🇯🇴 Jordan", 
    lebanon: "🇱🇧 Lebanon", iran: "🇮🇷 Iran", iraq: "🇮🇶 Iraq", israel: "🇮🇱 Israel",
    china: "🇨🇳 China", india: "🇮🇳 India", japan: "🇯🇵 Japan", southkorea: "🇰🇷 South Korea", 
    singapore: "🇸🇬 Singapore", australia: "🇦🇺 Australia", hongkong: "🇭🇰 Hong Kong", 
    malaysia: "🇲🇾 Malaysia", indonesia: "🇮🇩 Indonesia", thailand: "🇹🇭 Thailand", 
    vietnam: "🇻🇳 Vietnam", philippines: "🇵🇭 Philippines", pakistan: "🇵🇰 Pakistan", 
    bangladesh: "🇧🇩 Bangladesh", srilanka: "🇱🇰 Sri Lanka", taiwan: "🇹🇼 Taiwan", 
    newzealand: "🇳🇿 New Zealand",
    southafrica: "🇿🇦 South Africa", nigeria: "🇳🇬 Nigeria", egypt: "🇪🇬 Egypt", 
    kenya: "🇰🇪 Kenya", ghana: "🇬🇭 Ghana", morocco: "🇲🇦 Morocco", ethiopia: "🇪🇹 Ethiopia", 
    angola: "🇦🇴 Angola", algeria: "🇩🇿 Algeria", tunisia: "🇹🇳 Tunisia", rwanda: "🇷🇼 Rwanda", 
    tanzania: "🇹🇿 Tanzania", botswana: "🇧🇼 Botswana", uganda: "🇺🇬 Uganda", 
    senegal: "🇸🇳 Senegal", mozambique: "🇲🇿 Mozambique",
    kazakhstan: "🇰🇿 Kazakhstan", uzbekistan: "🇺🇿 Uzbekistan", azerbaijan: "🇦🇿 Azerbaijan", 
    turkmenistan: "🇹🇲 Turkmenistan", kyrgyzstan: "🇰🇬 Kyrgyzstan", georgia: "🇬🇪 Georgia", 
    armenia: "🇦🇲 Armenia", mongolia: "🇲🇳 Mongolia", nepal: "🇳🇵 Nepal", 
    cambodia: "🇰🇭 Cambodia", myanmar: "🇲🇲 Myanmar"
};

// ===== LINK DATA =====
const linksData = {
    "adobe summit|usa": "https://summit.adobe.com",
    "adipec|uae": "https://www.adipec.com",
    "advertising week new york|usa": "https://advertisingweek.com/",
    "africa food manufacturing|egypt": "https://www.africa-foodmanufacturing.com/en/home.html",
    "africa tech festival|southafrica": "https://africatechfestival.com",
    "africa's big 7|southafrica": "https://www.africabig7.com",
    "agritechnica|germany": "https://www.agritechnica.com/en/",
    "agro bangladesh international expo|bangladesh": "https://www.cems-agroexpo.com/",
    "agroworld uzbekistan|uzbekistan": "https://agroworld.uz/",
    "ai+ power hong kong|hongkong": "https://www.aipluspower.com/",
    "aima middle east forum|uae": "https://www.aima.org/events/aima-middle-east-forum-2025.html",
    "algeria energy expo|algeria": "https://www.algeriaenergyexpo.com",
    "ana masters of marketing conference|usa": "https://www.ana.net/conference/masters-of-marketing",
    "anuga|germany": "https://www.anuga.com",
    // ... [truncated for brevity - full links would be included]
    
    // === NEW MIDDLE EAST EVENT LINKS ===
    "finnovex qatar|qatar": "https://qa.finnovex.com/",
    "qatar leadership summit|qatar": "https://mbsedu.co.uk/qatar-leadership",
    "second world summit for social development|qatar": "https://www.un.org/development/desa/dspd/2025/02/second-world-summit-for-social-development-2025.html",
    "aim investment summit|uae": "https://aimcongress.com/",
    "ifatca 64th annual conference|uae": "https://www.ifatca.org/",
    "aesthetic & anti-aging medicine world congress|uae": "https://www.amwc-conference.com/",
    "finnovex saudi arabia|saudi": "https://sa.finnovex.com/",
    "oman fire, safety & security summit & expo|oman": "https://www.ofsecevent.com/",
    "home and building expo|oman": "https://omanhomeandbuilding.com/",
    "oman motor show|oman": "https://omanmotorshow.com/",
    "kuwait international trade fair|kuwait": "https://www.kitf-expo.com/",
    "thought leadership circle|kuwait": "https://www.thebusinessyear.com/event/thought-leadership-circle-empowering-energy-transformation/",
    "itc-egypt|egypt": "https://itc-egypt.org/"
};

// ===== UTILITY FUNCTIONS =====
function enrichEventsWithLinks(events, linksData) {
    events.forEach(event => {
        const eventNameLower = event.name.toLowerCase().replace(/ \d{4}( |$)/, '').replace(/[():/]/g, '').trim();
        let foundLink = false;
        for (const linkKey in linksData) {
            const [linkName, linkCountry] = linkKey.split('|');
            if (event.country === linkCountry && (eventNameLower.includes(linkName) || linkName.includes(eventNameLower))) {
                event.url = linksData[linkKey];
                foundLink = true;
                break;
            }
        }
    });
}

// Enrich events with links
enrichEventsWithLinks(events, linksData); 