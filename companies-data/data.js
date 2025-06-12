const companies = [
    {
        "name": "Mubadala Investment Company",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "investment-finance",
        "website": "https://www.mubadala.com",
        "description": "A sovereign investor managing a diverse portfolio of assets in the UAE and abroad, with a focus on technology, innovation, healthcare, and future-focused sectors to deliver sustainable financial returns for Abu Dhabi.",
        "address": "P.O. Box 45005, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/mubadala/" }
        ],
        "ai_use_case": "Opportunities: AI-driven investment analysis to identify high-growth opportunities, portfolio risk modeling, market trend prediction, and using data analytics to support strategic decisions in sectors like AI, life sciences, and renewable energy."
    },
    {
        "name": "First Abu Dhabi Bank (FAB)",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "investment-finance",
        "website": "https://www.bankfab.com",
        "description": "The UAE's largest bank, offering a full suite of products and services for retail, corporate, and investment banking clients, with a strong emphasis on digital transformation and innovation.",
        "address": "FAB Building, Khalifa Business Park, Al Qurm District, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/first-abu-dhabi-bank/" }
        ],
        "ai_use_case": "Opportunities: AI-powered fraud detection and risk assessment, personalized digital banking experiences, automating loan processing and underwriting, and developing new fintech solutions through its 'AI Innovation Hub'."
    },
    {
        "name": "Emirates NBD",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "investment-finance",
        "website": "https://www.emiratesnbd.com",
        "description": "A leading banking group in the MENAT region, providing a wide range of financial products and services, including retail, corporate, Islamic, and investment banking, with a strong focus on digital innovation.",
        "address": "P.O. Box 777, Deira, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/emirates-nbd/" }
        ],
        "ai_use_case": "Opportunities: AI-driven customer service chatbots, personalized product recommendations, advanced credit scoring models, robotic process automation (RPA) for back-office operations, and enhancing security with biometric authentication."
    },
    {
        "name": "Mashreq Bank",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "investment-finance",
        "website": "https://www.mashreqbank.com",
        "description": "A leading financial institution in the UAE, offering a comprehensive range of services in corporate, retail, and investment banking. Known for its digital-first approach and innovative solutions like Mashreq Neo.",
        "address": "P.O. Box 1250, Deira, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/mashreq-bank/" }
        ],
        "ai_use_case": "Opportunities: Hyper-personalization of customer interactions, AI-powered chatbots with high intent recognition, predictive analytics for risk management, and automating trade finance and loan syndication processes."
    },
    {
        "name": "Dubai Islamic Bank (DIB)",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "investment-finance",
        "website": "https://www.dib.ae",
        "description": "The first Islamic bank in the world and the largest in the UAE. DIB provides a full range of Sharia-compliant products and services for retail, corporate, and investment clients.",
        "address": "P.O. Box 1080, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/dubai-islamic-bank/" }
        ],
        "ai_use_case": "Opportunities: Developing AI-powered Sharia-compliant credit scoring models, automating trade finance operations, enhancing fraud detection, and offering personalized Islamic financial advisory services through digital channels."
    },
    {
        "name": "Bank Muscat",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "investment-finance",
        "website": "https://www.bankmuscat.com",
        "description": "Full-service commercial bank offering retail banking, corporate banking, investment banking, treasury, and Islamic banking services with digital transformation initiatives.",
        "address": "Bank Muscat Building, Ruwi High Street, P.O. Box 134, PC 112, Ruwi, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/bank-muscat" },
            { "name": "Twitter", "url": "https://twitter.com/BankMuscat" }
        ],
        "ai_use_case": "Opportunities: Customer service automation, fraud detection, risk analysis, loan processing, trading algorithms"
    },
    {
        "name": "Bank Dhofar",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "investment-finance",
        "website": "https://www.bankdhofar.com",
        "description": "One of the fastest-growing financial institutions in Oman, offering corporate banking, retail banking, and project finance with a strong focus on digital banking services. [15, 20]",
        "address": "P.O. Box 1507, Ruwi, PC 112, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/bankdhofar" },
            { "name": "Twitter", "url": "https://twitter.com/BankDhofar" }
        ],
        "ai_use_case": "Opportunities: AI-driven financial advisory services, automating trade finance documentation, enhancing cybersecurity with anomaly detection, and personalizing digital banking experiences."
    },
    {
        "name": "National Bank of Oman",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "investment-finance",
        "website": "https://www.nbo.om",
        "description": "Commercial banking services including personal banking, business banking, corporate banking, and Islamic banking solutions with focus on digital innovation.",
        "address": "National Bank of Oman Building, Shatti Al Qurum, P.O. Box 751, PC 112, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/national-bank-of-oman" },
            { "name": "Twitter", "url": "https://twitter.com/NBOOman" }
        ],
        "ai_use_case": "Opportunities: Chatbots, loan processing automation, compliance monitoring, customer insights, robo-advisory"
    },
    {
        "name": "Ahli Bank",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "investment-finance",
        "website": "https://ahlibank.om",
        "description": "A prominent financial institution providing a comprehensive suite of banking products and services for retail, corporate, and investment clients, with a reputation for customer-centricity.",
        "address": "P.O. Box 545, PC 112, Ruwi, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/ahlibankoman" },
            { "name": "Instagram", "url": "https://www.instagram.com/ahlibankoman/" }
        ],
        "ai_use_case": "Opportunities: Customer segmentation for targeted products, AI-powered chatbots for 24/7 support, fraud detection in real-time, and automating credit scoring models."
    },
    {
        "name": "Sohar International Bank",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "investment-finance",
        "website": "https://www.soharinternational.com",
        "description": "Comprehensive banking solutions including retail banking, corporate banking, SME banking, and digital banking services with innovative fintech partnerships.",
        "address": "Sohar International Building, P.O. Box 44, PC 114, Jibroo, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/sohar-international" },
            { "name": "Twitter", "url": "https://twitter.com/SoharIntBank" }
        ],
        "ai_use_case": "Opportunities: Digital transformation, AI-powered banking services, customer analytics, payment processing"
    },
    {
        "name": "Ominvest",
        "country": "oman",
        "location": "muscat",
        "size": "medium",
        "priority": "medium",
        "sector": "investment-finance",
        "website": "https://www.ominvest.net",
        "description": "One of the oldest and largest investment holding companies in the region, with significant stakes in banking, insurance, leasing, and real estate. [14]",
        "address": "P.O. Box 3886, Ruwi, PC 112, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/ominvest" }
        ],
        "ai_use_case": "Opportunities: Portfolio management and optimization, market sentiment analysis for investment decisions, risk assessment across subsidiaries, and automating due diligence processes."
    },
    {
        "name": "Muscat Finance Co. SAOG",
        "country": "oman",
        "location": "muscat",
        "size": "medium",
        "priority": "medium",
        "sector": "investment-finance",
        "website": "https://www.mfcoman.com",
        "description": "The first non-banking financial institution in Oman, offering a range of services including corporate lending, asset financing, trade finance, and consumer loans.",
        "address": "P.O. Box 108, PC 112, Ruwi, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/muscat-finance/" }
        ],
        "ai_use_case": "Opportunities: AI-driven credit scoring models, automating loan application processing, fraud detection in financial transactions, and personalized financial product recommendations."
    },
    {
        "name": "Al Anwar Holdings SAOG",
        "country": "oman",
        "location": "muscat",
        "size": "medium",
        "priority": "medium",
        "sector": "investment-finance",
        "website": "https://www.alanwar.com.om",
        "description": "A leading investment holding company with a diversified portfolio of investments in various sectors including financial services, industrial, and real estate within Oman and the broader region.",
        "address": "P.O. Box 1508, PC 112, Ruwi, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-anwar-holdings-saog/" }
        ],
        "ai_use_case": "Opportunities: AI-based investment analysis and portfolio management, market trend prediction, automating due diligence processes, and monitoring the performance of subsidiary companies."
    },
    {
        "name": "Abu Dhabi Commercial Bank (ADCB)",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "investment-finance",
        "website": "https://www.adcb.com",
        "description": "A full-service commercial bank offering a wide range of products and services in retail banking, wealth management, and corporate banking. ADCB is a leader in digitization and customer experience in the UAE.",
        "address": "P.O. Box 939, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/adcb/" }
        ],
        "ai_use_case": "Opportunities: AI for personalized wealth management advice, automating trade finance processes, enhancing security with behavioral biometrics, and predictive analytics for customer retention."
    },
    {
        "name": "Abu Dhabi Islamic Bank (ADIB)",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "medium",
        "sector": "investment-finance",
        "website": "https://www.adib.ae",
        "description": "A leading Islamic bank providing a full range of Sharia-compliant financial solutions to retail, corporate, and institutional customers. Known for its innovative digital banking services.",
        "address": "P.O. Box 313, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/abu-dhabi-islamic-bank/" }
        ],
        "ai_use_case": "Opportunities: Developing AI-powered Sharia-compliant investment tools, automating customer financing applications, AI chatbots for religious and financial queries, and risk modeling for Islamic finance products."
    },
    {
        "name": "Oman Arab Bank",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "investment-finance",
        "website": "https://www.oman-arabbank.com",
        "description": "A prominent bank in Oman offering a comprehensive range of products and services for retail, corporate, and investment banking customers, with a growing focus on digital transformation.",
        "address": "P.O. Box 2010, Ruwi, PC 112, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oman-arab-bank/" }
        ],
        "ai_use_case": "Opportunities: AI-driven credit risk assessment, personalized digital banking experiences, automating back-office processes, and using predictive analytics to offer tailored financial products."
    },
    {
        "name": "Dubai Holding",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "holding-groups",
        "website": "https://dubaiholding.com",
        "description": "A diversified global investment company with an extensive portfolio of assets in 13 countries across hospitality, real estate, media, ICT, and retail. Its portfolio includes Jumeirah Group, TECOM Group, and Dubai Properties.",
        "address": "P.O. Box 66000, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/dubai-holding/" }
        ],
        "ai_use_case": "Opportunities: Cross-portfolio data analysis for strategic insights, AI-driven asset management and performance forecasting, optimizing hospitality operations with personalized guest experiences, and smart city development within its real estate projects."
    },
    {
        "name": "ADQ",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "holding-groups",
        "website": "https://www.adq.ae",
        "description": "One of the region's largest holding companies with a broad portfolio of major enterprises spanning key sectors of Abu Dhabi's economy, including energy, utilities, healthcare, food and agriculture, and logistics.",
        "address": "Capital Gate, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/adq/" }
        ],
        "ai_use_case": "Opportunities: AI-powered performance monitoring across its diverse portfolio, identifying investment synergies between its companies, optimizing supply chains in food and agriculture, and driving digital transformation in healthcare and utilities."
    },
    {
        "name": "Al-Ghurair",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "holding-groups",
        "website": "https://www.al-ghurair.com/",
        "description": "One of the largest diversified family business groups in the Middle East, with operations in food and resources, properties, construction, energy, and ventures, including a significant presence in manufacturing and real estate.",
        "address": "Al Ghurair Centre, P.O. Box 6999, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-ghurair/" }
        ],
        "ai_use_case": "Opportunities: Optimizing production processes in its manufacturing units, AI-driven demand forecasting for its food division, predictive maintenance for construction equipment, and smart building management for its property portfolio."
    },
    {
        "name": "Al Habtoor Group",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "holding-groups",
        "website": "https://www.habtoor.com",
        "description": "A major UAE conglomerate with interests in hospitality, automotive, real estate, and education. The group owns several luxury hotels and is the official dealer for brands like Bentley, Bugatti, and McLaren.",
        "address": "P.O. Box 25444, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-habtoor-group-llc/" }
        ],
        "ai_use_case": "Opportunities: AI for optimizing hotel occupancy and revenue management, predictive analytics for luxury car sales, personalized customer service in the automotive division, and automating administrative processes in its schools."
    },
    {
        "name": "Al Rostamani Group",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "holding-groups",
        "website": "https://www.alrostamani.com",
        "description": "One of the largest and oldest family business conglomerates in the UAE, with a diverse portfolio that includes automotive (official dealer for Suzuki, Nissan, etc.), real estate, construction, and IT services.",
        "address": "P.O. Box 222, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-rostamani-group/" }
        ],
        "ai_use_case": "Opportunities: Predictive maintenance for automotive fleets, customer analytics for its retail divisions, lead scoring for vehicle sales, and optimizing logistics and supply chain operations across the group."
    },
    {
        "name": "Sharaf Group",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "holding-groups",
        "website": "https://www.sharafgroup.com",
        "description": "A highly diversified group with operations in over 40 countries. Its business interests include shipping, logistics, supply chain, retail (Sharaf DG), real estate, and financial services.",
        "address": "P.O. Box 2913, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/sharaf-group/" }
        ],
        "ai_use_case": "Opportunities: AI for supply chain optimization and warehouse automation, retail analytics and personalized marketing for Sharaf DG, demand forecasting for electronics, and optimizing shipping and logistics routes."
    },
    {
        "name": "Oman Investment Authority (OIA)",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "holding-groups",
        "website": "https://www.oia.gov.om",
        "description": "Oman's sovereign wealth fund, managing the government's assets and investments in over 160 companies across various sectors to support economic diversification under Vision 2040. [47, 48, 49, 50, 51]",
        "address": "Jamiat Al Duwal Al Arabiah, Al Khuwair, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oman-investment-authority" },
            { "name": "Twitter", "url": "https://twitter.com/OmanInvestAuth" }
        ],
        "ai_use_case": "Opportunities: Portfolio risk analysis, investment opportunity scouting, economic trend forecasting, and performance monitoring of subsidiary companies."
    },
    {
        "name": "Suhail Bahwan Group",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "holding-groups",
        "website": "https://www.suhailbahwangroup.com",
        "description": "One of Oman's largest conglomerates with interests in automotive, electronics, construction, fertilizers, healthcare, and IT. They are a major driver of economic activity in the Sultanate. [6, 40, 46]",
        "address": "P.O. Box 169, Muscat 100, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/suhail-bahwan-group-holding-llc" },
            { "name": "Twitter", "url": "https://twitter.com/suhailbahwan" }
        ],
        "ai_use_case": "Opportunities: Cross-subsidiary data analysis, corporate-level resource planning, group-wide procurement optimization, and automated financial consolidation."
    },
    {
        "name": "The Zubair Corporation",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "holding-groups",
        "website": "https://www.zubaircorp.com",
        "description": "A major diversified group with operations in energy, logistics, engineering, construction, automotive, and real estate. The group represents many global brands in Oman. [11, 25, 43, 45]",
        "address": "Azaibah Area, Ruwi, Muscat 112, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/the-zubair-corporation" },
            { "name": "Twitter", "url": "https://twitter.com/zubair_corp" }
        ],
        "ai_use_case": "Opportunities: Integrated logistics management, predictive analytics for automotive sales, project management automation for construction, and smart building management."
    },
    {
        "name": "MB Holding Company",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "holding-groups",
        "website": "https://www.mbholdingco.com/",
        "description": "A multinational corporation with core businesses in oilfield services, oil & gas exploration, mining, and engineering. [2, 8, 36]",
        "address": "P.O. Box 695, Al-Khuwair, PC 112, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/mb-holding-company-llc" }
        ],
        "ai_use_case": "Opportunities: Drilling optimization, geological data analysis, mining operations automation, and predictive maintenance for heavy machinery."
    },
    {
        "name": "Chalhoub Group",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "holding-groups",
        "website": "https://www.chalhoubgroup.com",
        "description": "A leading partner for luxury across the Middle East, with a portfolio in beauty, fashion, and art de vivre. They are experts in retail, distribution, and marketing services.",
        "address": "Jebel Ali Free Zone, P.O. Box 61331, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/chalhoub-group/" }
        ],
        "ai_use_case": "Opportunities: AI for personalized luxury retail experiences, analyzing customer data to predict high-end fashion trends, optimizing inventory for luxury goods, and automating supply chain for their distribution network."
    },
    {
        "name": "Khimji Ramdas Group (KR)",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "holding-groups",
        "website": "https://www.khimji.com",
        "description": "One of Oman's oldest and largest business conglomerates with diverse interests in consumer products, infrastructure, lifestyle, and logistics, representing numerous international brands.",
        "address": "P.O. Box 19, Ruwi, PC 112, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/khimji-ramdas-llc/" }
        ],
        "ai_use_case": "Opportunities: Demand forecasting for consumer products, optimizing distribution logistics across Oman, AI-powered customer service for their retail divisions, and predictive maintenance for their infrastructure projects."
    },
    {
        "name": "ADNOC",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "energy",
        "website": "https://www.adnoc.ae",
        "description": "The Abu Dhabi National Oil Company is one of the world's leading energy producers, operating across the entire hydrocarbon value chain, from exploration and production to refining and distribution.",
        "address": "P.O. Box 898, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/adnoc-group/" }
        ],
        "ai_use_case": "Opportunities: AI for optimizing drilling and production operations, predictive maintenance for critical equipment to reduce downtime, analyzing seismic data for exploration, and enhancing safety protocols through monitoring."
    },
    {
        "name": "Dubai Electricity and Water Authority (DEWA)",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "energy",
        "website": "https://www.dewa.gov.ae",
        "description": "The exclusive provider of electricity and water services in Dubai, actively investing in renewable energy and smart grid technologies to support Dubai's clean energy and smart city initiatives.",
        "address": "P.O. Box 564, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/dewa/" }
        ],
        "ai_use_case": "Opportunities: AI for smart grid management and demand-side response, predicting energy and water consumption, predictive maintenance for power plants and distribution networks, and customer service automation."
    },
    {
        "name": "Abu Dhabi National Energy Company (TAQA)",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "energy",
        "website": "https://www.taqa.com",
        "description": "A diversified international energy and water company operating in power generation, water desalination, oil and gas exploration and production, pipelines, and gas storage.",
        "address": "P.O. Box 55224, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/taqaglobal/" }
        ],
        "ai_use_case": "Opportunities: AI-driven predictive maintenance for utility assets, optimizing energy production and grid stability, managing water resources efficiently, and leveraging AI for oil and gas exploration analytics."
    },
    {
        "name": "Emirates National Oil Company (ENOC)",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "energy",
        "website": "https://www.enoc.com",
        "description": "A leading integrated global energy player owned by the Government of Dubai. The group operates across the entire energy value chain, including exploration, production, refining, marketing, and a large network of service stations.",
        "address": "P.O. Box 6442, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/enoc/" }
        ],
        "ai_use_case": "Opportunities: AI for retail analytics at service stations, optimizing fuel delivery logistics, demand forecasting for petroleum products, and predictive maintenance for refinery and terminal equipment."
    },
    {
        "name": "Petroleum Development Oman (PDO)",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "energy",
        "website": "https://www.pdo.co.om",
        "description": "Exploration, development and production of oil and gas resources in Oman. Operates the majority of Oman's oil and gas fields with advanced drilling and production technologies.",
        "address": "PDO Complex, Mina Al Fahal, Muscat 100, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/petroleum-development-oman" },
            { "name": "Twitter", "url": "https://twitter.com/PDOOman" }
        ],
        "ai_use_case": "Opportunities: Operations optimization, predictive maintenance, supply chain management, safety monitoring"
    },
    {
        "name": "OQ (Oman Oil Company)",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "energy",
        "website": "https://www.oq.com",
        "description": "Integrated energy company involved in exploration, production, refining, petrochemicals, marketing and trading of oil and gas with global operations.",
        "address": "Al Qurum Heights, Building 74, Way 3018, Muscat 112, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oq-oman" },
            { "name": "Twitter", "url": "https://twitter.com/OQOman" }
        ],
        "ai_use_case": "Opportunities: Process automation, data analytics, trading optimization, refinery operations"
    },
    {
        "name": "BP Oman",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "energy",
        "website": "https://www.bp.com/en/global/corporate/where-we-operate/middle-east/oman.html",
        "description": "Oil and gas exploration, development and production operations. Operates Khazzan tight gas project with advanced drilling technologies.",
        "address": "Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/bp" },
            { "name": "Twitter", "url": "https://twitter.com/BP_plc" }
        ],
        "ai_use_case": "Opportunities: Exploration data analysis, operational efficiency, environmental monitoring, drilling optimization"
    },
    {
        "name": "Oman LNG",
        "country": "oman",
        "location": "sur",
        "size": "large",
        "priority": "high",
        "sector": "energy",
        "website": "https://omanlng.com",
        "description": "One of the largest investment projects in Oman, the company produces and sells Liquefied Natural Gas (LNG) and its by-product, Natural Gas Liquids (NGLs). It operates three liquefaction trains at its plant in Qalhat near Sur.",
        "address": "Qalhat, near Sur, South Sharqiyah Governorate, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oman-lng" }
        ],
        "ai_use_case": "Opportunities: Production process optimization, predictive maintenance for liquefaction trains, logistics and shipping optimization, and energy trading analytics."
    },
    {
        "name": "Al Maha Petroleum Products Marketing Co.",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "energy",
        "website": "https://www.almahapetroleum.com.om",
        "description": "A leading fuel marketing company in Oman with a large network of filling stations, also providing lubricants and aviation fuels.",
        "address": "P.O. Box 60, PC 117, Wadi Kabir, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-maha-petroleum-products-marketing-co-saog/" }
        ],
        "ai_use_case": "Opportunities: Optimizing fuel delivery logistics, demand forecasting for individual stations, AI-powered customer loyalty programs, and predictive maintenance for fuel pumps and equipment."
    },
    {
        "name": "Shell Oman Marketing Company",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "energy",
        "website": "https://www.shell.com.om",
        "description": "A major player in Oman's downstream oil and gas sector, marketing a wide range of Shell fuels, lubricants, and bitumen. Operates a vast network of service stations across the country.",
        "address": "Mina Al Fahal, P.O. Box 38, PC 116, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/shell/" }
        ],
        "ai_use_case": "Opportunities: Route optimization for fuel tankers, dynamic pricing models, fraud detection in fuel card transactions, and automating inventory management for retail sites."
    },
    {
        "name": "Energy Development Oman (EDO)",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "energy",
        "website": "https://www.edo.om",
        "description": "A state-owned enterprise created to invest in and manage Oman's oil and gas assets, particularly in Block 6. It aims to finance PDO's operations and drive growth in the energy sector.",
        "address": "Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/energy-development-oman/" }
        ],
        "ai_use_case": "Opportunities: AI-driven analysis of oil and gas exploration data, optimizing capital allocation for energy projects, predictive modeling for reservoir performance, and financial risk assessment for investments."
    },
    {
        "name": "Oman Oil Marketing Company (OOMCO)",
        "country": "oman",
        "location": "multiple",
        "size": "large",
        "priority": "medium",
        "sector": "energy",
        "website": "https://www.oomco.com",
        "description": "A leading fuel marketing company in Oman, involved in the marketing and distribution of fuel and lubricant products. It operates a large network of service stations across the Sultanate.",
        "address": "P.O. Box 276, PC 117, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oman-oil-marketing-company/" }
        ],
        "ai_use_case": "Opportunities: AI for retail analytics at service stations, optimizing fuel delivery logistics to its network, demand forecasting for different fuel products, and personalized customer loyalty programs."
    },
    {
        "name": "DP World",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "logistics",
        "website": "https://www.dpworld.com",
        "description": "A global leader in port and terminal operations, maritime services, logistics, and supply chain solutions, enabling trade across the globe with a vast network of ports and economic zones.",
        "address": "Jebel Ali Free Zone, P.O. Box 17000, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/dp-world/" }
        ],
        "ai_use_case": "Opportunities: AI for optimizing port operations and container handling, predictive analytics for supply chain visibility, automating customs processes, and route optimization for logistics to reduce emissions and costs."
    },
    {
        "name": "Aramex",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "logistics",
        "website": "https://www.aramex.com",
        "description": "A leading global provider of comprehensive logistics and transportation solutions, offering services in express courier delivery, freight forwarding, logistics, and supply chain management, with a strong focus on e-commerce.",
        "address": "P.O. Box 3999, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/aramex/" }
        ],
        "ai_use_case": "Opportunities: AI-powered route optimization for last-mile delivery, predictive analytics for shipment volumes to manage capacity, automated sorting in hubs, and intelligent chatbots for customer tracking and inquiries."
    },
    {
        "name": "Etihad Rail",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "logistics",
        "website": "https://www.etihadrail.ae",
        "description": "The developer and operator of the UAE's national railway network. Etihad Rail connects the country's key centres of industry and population, transporting freight and eventually passengers across the Emirates.",
        "address": "P.O. Box 111100, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/etihad-rail/" }
        ],
        "ai_use_case": "Opportunities: Predictive maintenance for tracks and rolling stock using sensor data, optimizing freight schedules and network traffic, automating train operations, and enhancing safety with AI-powered track monitoring systems."
    },
    {
        "name": "Roads and Transport Authority (RTA) Dubai",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "logistics",
        "website": "https://www.rta.ae",
        "description": "The government agency responsible for planning and providing the transportation, roads, and traffic infrastructure in Dubai and between Dubai and other Emirates. It manages the metro, tram, buses, and marine transport.",
        "address": "P.O. Box 118899, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/roadsandtransportauthority/" }
        ],
        "ai_use_case": "Opportunities: AI-powered intelligent traffic management systems to ease congestion, optimizing public transport schedules based on real-time demand, predictive maintenance for the metro system, and AI chatbots for customer service."
    },
    {
        "name": "Asyad Group",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "logistics",
        "website": "https://www.asyad.om",
        "description": "Integrated logistics services including ports, shipping, logistics, and supply chain management solutions with comprehensive regional network.",
        "address": "Asyad Complex, Mina Sultan Qaboos, P.O. Box 133, PC 115, Muttrah, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/asyad-group" },
            { "name": "Twitter", "url": "https://twitter.com/AsyadGroup" }
        ],
        "ai_use_case": "Opportunities: Route optimization, inventory management, supply chain analytics, fleet management"
    },
    {
        "name": "SOHAR Port and Freezone",
        "country": "oman",
        "location": "sohar",
        "size": "large",
        "priority": "high",
        "sector": "logistics",
        "website": "https://www.soharportandfreezone.com",
        "description": "A deep-sea port and adjacent free zone that is one of the world's fastest-growing. It is a key logistics hub for industry, handling a diverse range of cargo and attracting significant foreign investment. [16]",
        "address": "P.O. Box 9, PC 327, Sohar, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/sohar-port-and-freezone" },
            { "name": "Twitter", "url": "https://twitter.com/soharport" }
        ],
        "ai_use_case": "Opportunities: Smart traffic management for trucks, vessel turnaround time prediction, optimizing container stacking and terminal operations, and predictive maintenance for port equipment."
    },
    {
        "name": "Port of Duqm",
        "country": "oman",
        "location": "duqm",
        "size": "large",
        "priority": "high",
        "sector": "logistics",
        "website": "https://www.portofduqm.om",
        "description": "A mega-port and industrial zone that is a cornerstone of Oman's economic future. It offers ship repair, drydock services, and handles diverse cargo, strategically located outside the Strait of Hormuz. [4, 18]",
        "address": "P.O. Box 22, PC 710, Duqm, Al Wusta Governorate, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/port-of-duqm" }
        ],
        "ai_use_case": "Opportunities: Optimizing ship repair schedules, resource allocation for drydock services, managing industrial zone logistics, and automating security and surveillance."
    },
    {
        "name": "Port of Salalah",
        "country": "oman",
        "location": "salalah",
        "size": "large",
        "priority": "high",
        "sector": "logistics",
        "website": "https://www.salalahport.com",
        "description": "Major container terminal operations, cargo handling, logistics services, and transshipment hub for the Indian Ocean region with automated container handling systems.",
        "address": "Port of Salalah, P.O. Box 105, PC 211, Salalah, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/port-of-salalah" },
            { "name": "Twitter", "url": "https://twitter.com/PortofSalalah" }
        ],
        "ai_use_case": "Opportunities: Cargo optimization, scheduling automation, supply chain visibility, predictive maintenance"
    },
    {
        "name": "Renaissance Services SAOG",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "logistics",
        "website": "https://www.renaissanceservices.com",
        "description": "A diversified, publicly-traded company providing integrated facility management, marine offshore support vessels, and contract services, primarily for the oil and gas industry.",
        "address": "P.O. Box 1676, Muttrah, PC 114, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/renaissance-services-saog/" }
        ],
        "ai_use_case": "Opportunities: Predictive maintenance for offshore vessels, optimizing logistics for remote site facilities management, workforce scheduling automation, and improving safety protocols through data analysis."
    },
    {
        "name": "Salalah Port Services Co. SAOG",
        "country": "oman",
        "location": "salalah",
        "size": "medium",
        "priority": "medium",
        "sector": "logistics",
        "website": "https://www.salalahport.com",
        "description": "The port authority for the Port of Salalah, a major transshipment hub on the Arabian Sea. It handles container and general cargo, playing a vital role in global trade routes.",
        "address": "P.O. Box 105, PC 211, Salalah, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/port-of-salalah/" }
        ],
        "ai_use_case": "Opportunities: AI-driven optimization of container terminal operations, predictive analytics for vessel arrival times, automating gate operations for trucks, and improving supply chain visibility for clients."
    },
    {
        "name": "Emirates Group",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "aviation",
        "website": "https://www.theemiratesgroup.com",
        "description": "Comprises Emirates, the world's largest international airline, and dnata, one of the world's largest air services providers. A key player in global aviation, tourism, and logistics.",
        "address": "P.O. Box 686, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/emirates/" }
        ],
        "ai_use_case": "Opportunities: Generative AI for personalized customer experiences and cabin crew training, predictive maintenance for aircraft, dynamic pricing and revenue management, and optimizing flight routes for fuel efficiency."
    },
    {
        "name": "Etihad Airways",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "aviation",
        "website": "https://www.etihad.com",
        "description": "The national airline of the United Arab Emirates, operating a fleet of aircraft to an international network of passenger and cargo destinations from its hub in Abu Dhabi. Known for its focus on premium travel experiences.",
        "address": "P.O. Box 35566, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/etihad-airways/" }
        ],
        "ai_use_case": "Opportunities: Generative AI for personalized customer service and travel planning, predictive maintenance for aircraft fleets, dynamic pricing and revenue management, and optimizing crew schedules and flight operations."
    },
    {
        "name": "Dubai Airports",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "aviation",
        "website": "https://www.dubaiairports.ae",
        "description": "The operator of both of Dubai's airports – Dubai International (DXB), one of the world's busiest hubs for international passengers, and Dubai World Central (DWC).",
        "address": "P.O. Box 2525, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/dubaiairports/" }
        ],
        "ai_use_case": "Opportunities: AI-driven passenger flow management to reduce queues, optimizing baggage handling systems, predictive maintenance for airport infrastructure, and intelligent allocation of gates, stands, and resources."
    },
    {
        "name": "flydubai",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "aviation",
        "website": "https://www.flydubai.com",
        "description": "A government-owned low-cost airline in Dubai, operating to over 90 destinations across the Middle East, Africa, Asia, and Europe, playing a crucial role in connecting Dubai to emerging markets.",
        "address": "c/o Emirates Group Headquarters, P.O. Box 686, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/flydubai/" }
        ],
        "ai_use_case": "Opportunities: AI for route profitability analysis, dynamic pricing models for ancillary services, automating customer service inquiries, and optimizing crew scheduling and aircraft turnaround times."
    },
    {
        "name": "Air Arabia",
        "country": "uae",
        "location": "sharjah",
        "size": "large",
        "priority": "medium",
        "sector": "aviation",
        "website": "https://www.airarabia.com",
        "description": "The Middle East and North Africa's first and largest low-cost carrier (LCC), operating a network of flights from its hubs in the UAE, Morocco, and Egypt to destinations across the globe.",
        "address": "Sharjah International Airport, P.O. Box 132, Sharjah, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/air-arabia/" }
        ],
        "ai_use_case": "Opportunities: AI for route profitability analysis and network planning, dynamic pricing of ancillary services, automating customer support with chatbots, and optimizing fuel consumption across its fleet."
    },
    {
        "name": "Oman Air",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "aviation",
        "website": "https://www.omanair.com",
        "description": "The national airline of Oman, operating domestic and international flights to over 50 destinations. It is central to the country's tourism and business travel strategy.",
        "address": "Muscat International Airport, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oman-air" },
            { "name": "Twitter", "url": "https://twitter.com/omanair" }
        ],
        "ai_use_case": "Opportunities: Dynamic pricing, revenue management, customer service personalization, predictive maintenance for aircraft, and flight operations optimization."
    },
    {
        "name": "SalamAir",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "aviation",
        "website": "https://www.salamair.com",
        "description": "A low-cost airline based in Oman, operating flights across the Middle East and to international destinations. It plays a significant role in enhancing connectivity within the region.",
        "address": "Muscat International Airport, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/salamair" },
            { "name": "Instagram", "url": "https://www.instagram.com/salamair/" }
        ],
        "ai_use_case": "Opportunities: Route profitability analysis, automated customer support, ancillary revenue optimization, and targeted marketing campaigns."
    },
    {
        "name": "Oman Airports",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "aviation",
        "website": "https://www.omanairports.co.om",
        "description": "The state-owned company responsible for the management and operation of the civil airports in the Sultanate of Oman, including Muscat International Airport and Salalah Airport.",
        "address": "P.O. Box 1707, PC 111, Muscat International Airport, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oman-airports/" }
        ],
        "ai_use_case": "Opportunities: AI to optimize passenger flow and reduce wait times, predictive maintenance for airport infrastructure, smart resource allocation (gates, baggage carousels), and enhancing airport security with intelligent surveillance."
    },
    {
        "name": "e& (formerly Etisalat)",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "telecommunications",
        "website": "https://www.eand.com",
        "description": "A global technology and investment group, offering telecommunications, mobile, internet, and digital solutions to millions of customers across the Middle East, Asia, and Africa.",
        "address": "P.O. Box 3838, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/eand/" }
        ],
        "ai_use_case": "Opportunities: AI-driven network optimization and predictive maintenance, personalized customer service through chatbots and virtual assistants, churn prediction models, and developing new smart city and IoT solutions."
    },
    {
        "name": "du (EITC)",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "telecommunications",
        "website": "https://www.du.ae",
        "description": "The Emirates Integrated Telecommunications Company (EITC) is one of the two main telecom operators in the UAE, providing mobile and fixed telephony, broadband connectivity, and IPTV services to individuals and businesses.",
        "address": "P.O. Box 502666, Dubai Media City, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/du/" }
        ],
        "ai_use_case": "Opportunities: AI for network traffic management and predictive maintenance, customer churn prediction models, personalized product and service recommendations, and developing IoT and smart city solutions for enterprise clients."
    },
    {
        "name": "Omantel",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "telecommunications",
        "website": "https://www.omantel.om",
        "description": "Leading telecommunications provider offering mobile, fixed-line, internet, data services, and digital solutions for consumers and enterprises with 5G network rollout.",
        "address": "Omantel Complex, P.O. Box 789, PC 112, Ruwi, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/omantel" },
            { "name": "Twitter", "url": "https://twitter.com/Omantel" }
        ],
        "ai_use_case": "Opportunities: Network optimization, customer support automation, service management, predictive maintenance"
    },
    {
        "name": "Ooredoo Oman",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "telecommunications",
        "website": "https://www.ooredoo.om",
        "description": "Major mobile telecommunications operator providing broadband internet, digital services, and ICT solutions for consumers and businesses with advanced network infrastructure.",
        "address": "Ooredoo Tower, Al Irfan Street, P.O. Box 500, PC 112, Ruwi, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/ooredoo-oman" },
            { "name": "Twitter", "url": "https://twitter.com/OoredooOman" }
        ],
        "ai_use_case": "Opportunities: Customer analytics, network maintenance automation, digital service optimization, churn prediction"
    },
    {
        "name": "Emaar Properties",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "real-estate-construction",
        "website": "https://www.emaar.com",
        "description": "A global property developer known for large-scale projects and iconic landmarks such as the Burj Khalifa and The Dubai Mall. It has a significant presence in hospitality, retail, and residential development.",
        "address": "P.O. Box 9440, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/emaar/" }
        ],
        "ai_use_case": "Opportunities: AI for property management and maintenance scheduling, customer sentiment analysis from social media, lead generation for property sales, and creating smart community experiences with IoT integration."
    },
    {
        "name": "Aldar Properties",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "real-estate-construction",
        "website": "https://www.aldar.com",
        "description": "A leading real estate developer in Abu Dhabi, responsible for creating major residential, commercial, and retail projects on Yas Island, Saadiyat Island, and Al Raha Beach.",
        "address": "P.O. Box 51133, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/aldar-properties/" }
        ],
        "ai_use_case": "Opportunities: AI-driven property valuation models, optimizing construction project management, personalized marketing for potential buyers and tenants, and enhancing facility management with predictive maintenance."
    },
    {
        "name": "DAMAC Properties",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "real-estate-construction",
        "website": "https://www.damacproperties.com",
        "description": "A prominent luxury real estate developer in the Middle East, delivering residential, commercial, and leisure properties. Known for its iconic projects and collaborations with global brands like Versace and de GRISOGONO.",
        "address": "P.O. Box 2195, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/damac-properties/" }
        ],
        "ai_use_case": "Opportunities: AI-powered lead generation and scoring for potential buyers, dynamic pricing models for properties, smart home integration in new developments, and personalized marketing campaigns based on customer data."
    },
    {
        "name": "Nakheel",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "real-estate-construction",
        "website": "https://www.nakheel.com",
        "description": "A world-leading master developer whose innovative projects have become iconic symbols of Dubai, including Palm Jumeirah, The World, and Jumeirah Islands. The portfolio includes residential, retail, hospitality, and leisure developments.",
        "address": "P.O. Box 17777, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/nakheel/" }
        ],
        "ai_use_case": "Opportunities: AI for smart community management (traffic, security, utilities) in its large-scale projects, predictive maintenance for infrastructure, customer sentiment analysis, and retail analytics for its malls and pavilions."
    },
    {
        "name": "Al Mouj Muscat",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "real-estate-construction",
        "website": "https://www.almouj.com",
        "description": "Oman's leading integrated tourism complex (ITC), offering luxury residential properties, a world-class marina, a golf course, and retail and dining experiences. [3]",
        "address": "P.O. Box 1, PC 138, Seeb, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-mouj-muscat" },
            { "name": "Instagram", "url": "https://www.instagram.com/almoujmuscat/" }
        ],
        "ai_use_case": "Opportunities: Smart community management, property sales lead generation and nurturing, personalized resident services, and predictive maintenance for community assets."
    },
    {
        "name": "Galfar Engineering & Contracting",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "real-estate-construction",
        "website": "https://www.galfar.com",
        "description": "Engineering, procurement, construction services, oil & gas infrastructure, and industrial projects with comprehensive project management.",
        "address": "Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/galfar-engineering-contracting" }
        ],
        "ai_use_case": "Opportunities: Project management automation, resource optimization, safety monitoring, cost estimation"
    },
    {
        "name": "Al Nab'a Holding LLC",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "real-estate-construction",
        "website": "http://www.alnabaholding.com/",
        "description": "A multifaceted holding company with significant operations in construction and facility management, offering services like integrated facility management, cleaning, and catering.",
        "address": "Al Naba House, Ghala Industrial Area, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-nab-a-group/" }
        ],
        "ai_use_case": "Opportunities: Predictive maintenance for managed facilities, optimization of cleaning and maintenance schedules, workforce management and deployment, and automation of catering and supply chain logistics."
    },
    {
        "name": "Towell Group",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "real-estate-construction",
        "website": "https://www.wjtowell.com",
        "description": "A highly diversified family-owned business with major interests in real estate, construction, automotive, consumer products, and engineering.",
        "address": "P.O. Box 7061, Muttrah, PC 112, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/w-j-towell-&-co--llc" }
        ],
        "ai_use_case": "Opportunities: AI for property valuation, optimizing construction project timelines and costs, demand forecasting for consumer goods, and automating inventory management."
    },
    {
        "name": "Al Tasnim Group",
        "country": "oman",
        "location": "muscat",
        "size": "medium",
        "priority": "medium",
        "sector": "real-estate-construction",
        "website": "https://www.altasnim.com",
        "description": "A leading construction and contracting group in Oman, with divisions for civil construction, oil & gas, MEP, and manufacturing of construction materials like cement products and asphalt.",
        "address": "P.O. Box 276, PC 117, Al Wadi Al Kabir, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-tasnim-group" }
        ],
        "ai_use_case": "Opportunities: Bidding process automation, project cost estimation, worker safety monitoring using computer vision, and optimizing deployment of heavy equipment."
    },
    {
        "name": "Teejan Group",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "real-estate-construction",
        "website": "https://www.teejan.com",
        "description": "A diversified group with major activities in construction, engineering, fire & security systems, and laboratory solutions. They are involved in many of Oman's key infrastructure projects.",
        "address": "P.O. Box 276, PC 117, Ghala, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/teejan-group/" }
        ],
        "ai_use_case": "Opportunities: AI-powered project bidding and cost estimation, construction site safety monitoring using computer vision, optimizing supply chain for building materials, and smart building management systems."
    },
    {
        "name": "Al Adrak Trading & Contracting Co",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "real-estate-construction",
        "website": "https://www.aladrak.com",
        "description": "A leading construction company in Oman with an extensive portfolio of projects including airports, hospitals, hotels, and industrial facilities. Known for executing large-scale and complex projects.",
        "address": "P.O. Box 1100, PC 112, Ruwi, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-adrak-trading-and-contracting-co-llc" }
        ],
        "ai_use_case": "Opportunities: Automation of project scheduling and resource allocation, predictive analytics for project risk management, drone-based site monitoring and progress reporting, and optimizing building energy efficiency."
    },
    {
        "name": "Sobha Realty",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "real-estate-construction",
        "website": "https://www.sobharealty.com",
        "description": "A premium real estate developer known for its exceptional quality and backward-integrated model, where it controls all aspects of the construction process. Key projects include Sobha Hartland.",
        "address": "Sobha Hartland, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/sobha-realty/" }
        ],
        "ai_use_case": "Opportunities: AI to monitor construction progress through computer vision, predictive analytics for project timelines and cost management, smart home automation in residential units, and lead scoring for potential buyers."
    },
    {
        "name": "Meraas",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "real-estate-construction",
        "website": "https://www.meraas.com",
        "description": "A Dubai-based holding company and master developer of unique lifestyle destinations such as City Walk, Bluewaters Island, and La Mer, integrating residential, retail, and hospitality.",
        "address": "P.O. Box 123311, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/meraas/" }
        ],
        "ai_use_case": "Opportunities: AI-driven analysis of visitor footfall and behavior in retail destinations, personalized marketing for leisure and entertainment offerings, optimizing tenant mix in commercial properties, and smart community management."
    },
    {
        "name": "Al Hassan Engineering Co. SAOG",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "real-estate-construction",
        "website": "https://www.al-hassan.com",
        "description": "A leading EPC contractor in Oman with a focus on oil, gas, petrochemicals, power, and water sectors. They have a strong track record of executing complex industrial projects.",
        "address": "P.O. Box 1948, Ruwi, PC 112, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-hassan-engineering-co--saog/" }
        ],
        "ai_use_case": "Opportunities: AI for project risk management, optimizing engineering design processes, predictive maintenance for construction equipment, and ensuring worker safety through real-time monitoring."
    },
    {
        "name": "Emirates Global Aluminium (EGA)",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "industrial-manufacturing",
        "website": "https://www.ega.ae",
        "description": "The world's largest 'premium aluminium' producer and the biggest industrial company in the UAE outside of oil and gas. EGA operates aluminium smelters in Abu Dhabi and Dubai and a bauxite mine in Guinea.",
        "address": "Al Taweelah, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/emirates-global-aluminium/" }
        ],
        "ai_use_case": "Opportunities: AI for optimizing the smelting process (potline stability), predictive maintenance for heavy machinery, quality control using computer vision, and maximizing energy efficiency in production."
    },
    {
        "name": "Emirates Steel Arkan",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "industrial-manufacturing",
        "website": "https://www.emiratessteelarkan.com",
        "description": "The UAE's largest steel and building materials manufacturer, producing high-quality rebar, wire rod, and heavy sections. The group is a key player in the region's industrial and construction sectors.",
        "address": "Industrial City of Abu Dhabi (ICAD), Mussafah, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/emirates-steel-arkan/" }
        ],
        "ai_use_case": "Opportunities: AI-powered quality control in the manufacturing process, optimizing furnace energy consumption, predictive maintenance for rolling mills, and production planning based on demand forecasts."
    },
    {
        "name": "Borouge",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "medium",
        "sector": "industrial-manufacturing",
        "website": "https://www.borouge.com",
        "description": "A leading petrochemical company that provides innovative, value-creating plastics solutions for the energy, infrastructure, mobility, packaging, healthcare, and agriculture industries.",
        "address": "P.O. Box 6925, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/borouge/" }
        ],
        "ai_use_case": "Opportunities: AI for optimizing chemical production processes, predictive maintenance for plant equipment, quality control using computer vision, and automating supply chain and logistics operations for polymer distribution."
    },
    {
        "name": "RAK Ceramics",
        "country": "uae",
        "location": "rasalkhaimah",
        "size": "large",
        "priority": "medium",
        "sector": "industrial-manufacturing",
        "website": "https://www.rakceramics.com",
        "description": "One of the largest ceramics brands in the world, specializing in ceramic and gres porcelain wall and floor tiles, tableware, sanitaryware and faucets, with a global distribution network.",
        "address": "P.O. Box 4714, Ras Al Khaimah, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/rakceramics/" }
        ],
        "ai_use_case": "Opportunities: Computer vision for automated quality inspection of tiles and sanitaryware, optimizing kiln firing parameters for energy savings, demand forecasting for different product lines, and managing global supply chain logistics."
    },
    {
        "name": "Sohar Aluminium",
        "country": "oman",
        "location": "sohar",
        "size": "large",
        "priority": "high",
        "sector": "industrial-manufacturing",
        "website": "https://www.sohar-aluminium.com",
        "description": "Aluminum smelting, aluminum products manufacturing, and metal processing services with state-of-the-art smelting technology.",
        "address": "Sohar Industrial Zone, P.O. Box 84, PC 321, Sohar, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/sohar-aluminium" }
        ],
        "ai_use_case": "Opportunities: Process optimization, safety monitoring, production analytics, furnace management"
    },
    {
        "name": "Raysut Cement Company",
        "country": "oman",
        "location": "salalah",
        "size": "large",
        "priority": "high",
        "sector": "industrial-manufacturing",
        "website": "https://www.raysutcement.com",
        "description": "Cement manufacturing, concrete products, and construction materials for infrastructure and building projects with modern production facilities.",
        "address": "Raysut Industrial Area, P.O. Box 363, PC 211, Salalah, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/raysut-cement-company" }
        ],
        "ai_use_case": "Opportunities: Quality control automation, predictive maintenance, energy optimization, production planning"
    },
    {
        "name": "Oman Cables Industry",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "industrial-manufacturing",
        "website": "https://www.omancables.com",
        "description": "A leading manufacturer and exporter of electrical cables and conductors for various applications, including energy, construction, and industrial projects. [5, 23]",
        "address": "Rusayl Industrial Estate, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oman-cables-industry-saog-" }
        ],
        "ai_use_case": "Opportunities: Production line quality control using computer vision, demand forecasting for raw materials, energy consumption optimization, and supply chain logistics automation."
    },
    {
        "name": "Voltamp Energy SAOG",
        "country": "oman",
        "location": "rusayl",
        "size": "medium",
        "priority": "medium",
        "sector": "industrial-manufacturing",
        "website": "https://www.voltampoman.com",
        "description": "A leading manufacturer of power and distribution transformers, low voltage switchgear, and packaged substations, serving the electricity, water, oil & gas, and industrial sectors.",
        "address": "P.O. Box 133, PC 124, Rusayl Industrial Estate, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/voltamp-energy-saog/" }
        ],
        "ai_use_case": "Opportunities: AI for quality control in the manufacturing process, demand forecasting for electrical products, optimizing raw material procurement, and predictive maintenance for manufactured assets."
    },
    {
        "name": "Al Jazeera Steel Products Co.",
        "country": "oman",
        "location": "sohar",
        "size": "medium",
        "priority": "medium",
        "sector": "industrial-manufacturing",
        "website": "https://www.jazeerasteel.com",
        "description": "A leading manufacturer of steel products including pipes, tubes, and merchant bars. They cater to the construction, oil & gas, and manufacturing sectors across the MENA region.",
        "address": "Sohar Industrial Estate, P.O. Box 189, PC 322, Sohar, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-jazeera-steel-products-co-saog/" }
        ],
        "ai_use_case": "Opportunities: Production planning optimization, computer vision for quality inspection of steel products, predicting equipment failure in the production line, and optimizing energy consumption in furnaces."
    },
    {
        "name": "Oman Methanol Company (OMC)",
        "country": "oman",
        "location": "sohar",
        "size": "large",
        "priority": "high",
        "sector": "industrial-manufacturing",
        "website": "https://www.omanmethanol.com",
        "description": "A leading producer of high-quality methanol, located in the Sohar Port industrial area. The company is a key part of Oman's downstream petrochemicals industry. [1]",
        "address": "Sohar Industrial Port, P.O. Box 464, PC 322, Sohar, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oman-methanol-company-llc" }
        ],
        "ai_use_case": "Opportunities: Plant efficiency monitoring, predictive maintenance for reactors and compressors, supply chain optimization for feedstock, and energy consumption analysis."
    },
    {
        "name": "Jindal Shadeed Iron & Steel",
        "country": "oman",
        "location": "sohar",
        "size": "large",
        "priority": "high",
        "sector": "industrial-manufacturing",
        "website": "https://www.jindalshadeed.com",
        "description": "One of the largest integrated steel producers in the region, manufacturing high-quality steel products for construction and industrial applications.",
        "address": "Sohar Port, P.O. Box 310, PC 322, Sohar, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/jindal-shadeed-iron-and-steel" }
        ],
        "ai_use_case": "Opportunities: AI-based quality control through image analysis, optimizing furnace temperature and energy use, production planning based on demand forecasts, and predictive maintenance of rolling mills."
    },
    {
        "name": "National Detergent Company (NDC)",
        "country": "oman",
        "location": "muscat",
        "size": "medium",
        "priority": "medium",
        "sector": "industrial-manufacturing",
        "website": "https://www.ndcoman.com",
        "description": "Manufacturer of leading home and personal care brands like Bahar, No.1, and Luv. The company exports its products to over 40 countries.",
        "address": "Rusayl Industrial Estate, P.O. Box 7, PC 124, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/national-detergent-co-saog" }
        ],
        "ai_use_case": "Opportunities: Consumer demand forecasting, optimizing marketing spend, raw material price prediction, and automating production line quality checks."
    },
    {
        "name": "Oman Chlorine SAOG",
        "country": "oman",
        "location": "sohar",
        "size": "medium",
        "priority": "medium",
        "sector": "industrial-manufacturing",
        "website": "https://www.omanchlorine.com",
        "description": "Manufacturer and distributor of industrial chemicals such as Caustic Soda, Hydrochloric Acid, and Sodium Hypochlorite, essential for the oil & gas, petrochemical, and water treatment industries.",
        "address": "Sohar Industrial Port, P.O. Box 426, PC 322, Sohar, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oman-chlorine-saog/" }
        ],
        "ai_use_case": "Opportunities: Optimizing chemical production processes, predictive maintenance for plant equipment, demand forecasting for chemical products, and automating supply chain and logistics operations."
    },
    {
        "name": "Ducab Group",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "industrial-manufacturing",
        "website": "https://www.ducab.com",
        "description": "A global leader in the development, design, manufacture, and supply of copper and aluminum wire and cable products for the energy, construction, and industrial sectors.",
        "address": "Jebel Ali, P.O. Box 11529, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/ducab/" }
        ],
        "ai_use_case": "Opportunities: AI for quality control in cable manufacturing using computer vision, predictive maintenance for production machinery, optimizing raw material procurement, and automating supply chain logistics."
    },
    {
        "name": "Al Ghurair Iron & Steel (AGIS)",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "industrial-manufacturing",
        "website": "https://www.agis.ae",
        "description": "A leading manufacturer of high-quality galvanized and cold-rolled steel coils. Part of the larger Al Ghurair Group, it serves the construction and manufacturing industries across the region.",
        "address": "Industrial City of Abu Dhabi (ICAD), Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-ghurair-iron-steel-llc/" }
        ],
        "ai_use_case": "Opportunities: AI-powered quality control during the galvanizing process, optimizing energy consumption in furnaces, predictive maintenance for rolling mills, and production planning based on demand forecasts."
    },
    {
        "name": "Sohar Port and Freezone",
        "country": "oman",
        "location": "sohar",
        "size": "large",
        "priority": "medium",
        "sector": "industrial-manufacturing",
        "website": "https://www.soharportandfreezone.com",
        "description": "A deep-sea port and adjacent free zone that is a major hub for industrial activity, logistics, and trade. It hosts major tenants in petrochemicals, metals, and logistics.",
        "address": "P.O. Box 9, PC 327, Sohar, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/sohar-port-and-freezone/" }
        ],
        "ai_use_case": "Opportunities: AI to optimize vessel traffic and scheduling, smart logistics for container handling, predictive maintenance for port infrastructure, and automating security and surveillance across the freezone."
    },
    {
        "name": "Majid Al Futtaim",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "retail",
        "website": "https://www.majidalfuttaim.com",
        "description": "A leading shopping mall, communities, retail, and leisure pioneer across the Middle East, Africa, and Asia, operating Carrefour hypermarkets and iconic malls like Mall of the Emirates.",
        "address": "P.O. Box 91100, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/majid-al-futtaim/" }
        ],
        "ai_use_case": "Opportunities: AI-powered analysis of shopper behavior, personalized marketing and loyalty programs, optimizing inventory management for Carrefour, and smart mall operations including security and maintenance."
    },
    {
        "name": "Al Futtaim Group",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "retail",
        "website": "https://www.alfuttaim.com",
        "description": "A large, diversified conglomerate with operations in automotive, financial services, real estate, and retail, representing many of the world's leading brands in the region.",
        "address": "P.O. Box 156, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-futtaim/" }
        ],
        "ai_use_case": "Opportunities: Predictive analytics for automotive sales and maintenance, optimizing supply chain for retail brands, AI-driven customer relationship management (CRM), and personalized financial service offerings."
    },
    {
        "name": "Landmark Group",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "retail",
        "website": "https://www.landmarkgroup.com",
        "description": "A multinational conglomerate involved in retail and hospitality, operating a vast network of brands like Centrepoint, Home Centre, and Max Fashion across the Middle East, Africa, and India.",
        "address": "Landmark Tower, Dubai Marina, P.O. Box 25030, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/landmark-group/" }
        ],
        "ai_use_case": "Opportunities: Demand forecasting and inventory optimization across brands, AI-powered supply chain management, personalized e-commerce experiences, and analyzing customer purchasing patterns to inform product development."
    },
    {
        "name": "Al Tayer Group",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "retail",
        "website": "https://www.altayer.com",
        "description": "A diversified business group with a strong presence in luxury and lifestyle retail, automotive, and ventures. They represent leading brands like Harvey Nichols, Bloomingdale's, Ford, and Ferrari in the Middle East.",
        "address": "P.O. Box 2623, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-tayer-group/" }
        ],
        "ai_use_case": "Opportunities: AI for creating personalized luxury shopping experiences, inventory management and demand forecasting for high-end fashion, customer analytics to understand luxury consumer behavior, and optimizing automotive service operations."
    },
    {
        "name": "Dubai Duty Free",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "retail",
        "website": "https://www.dubaidutyfree.com",
        "description": "The world's single largest airport retailer, operating the duty-free operations at Dubai International Airport and Al Maktoum International Airport. It is renowned for its extensive range of products and promotions.",
        "address": "P.O. Box 831, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/dubai-duty-free/" }
        ],
        "ai_use_case": "Opportunities: Analyzing passenger data to predict purchasing behavior, optimizing inventory based on flight schedules and passenger demographics, personalized digital promotions, and managing queues with computer vision."
    },
    {
        "name": "Lulu Hypermarket Oman",
        "country": "oman",
        "location": "multiple",
        "size": "large",
        "priority": "high",
        "sector": "retail",
        "website": "https://www.luluhypermarket.com/om",
        "description": "Retail hypermarket chain offering groceries, electronics, fashion, home goods, and consumer products with extensive regional presence.",
        "address": "Multiple locations across Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/lulu-group-international" },
            { "name": "Instagram", "url": "https://www.instagram.com/luluoman" }
        ],
        "ai_use_case": "Opportunities: Inventory optimization, customer analytics, supply chain management, personalized recommendations"
    },
    {
        "name": "Carrefour Oman",
        "country": "oman",
        "location": "multiple",
        "size": "large",
        "priority": "high",
        "sector": "retail",
        "website": "https://www.carrefouromanblog.com",
        "description": "Hypermarket and supermarket retail chain offering groceries, electronics, fashion, and household items with omnichannel retail approach.",
        "address": "Multiple locations across Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/carrefour" },
            { "name": "Instagram", "url": "https://www.instagram.com/carrefouroman" }
        ],
        "ai_use_case": "Opportunities: Demand forecasting, personalized marketing, operational efficiency, checkout automation"
    },
    {
        "name": "Apparel Group",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "retail",
        "website": "https://apparelglobal.com/en/",
        "description": "A global fashion and lifestyle retail conglomerate with a vast network of stores and brands across the GCC and beyond, including brands like Tim Hortons, ALDO, and Nine West.",
        "address": "Jebel Ali Free Zone, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/apparelgroup/" }
        ],
        "ai_use_case": "Opportunities: AI for inventory management and demand forecasting across numerous brands, personalized marketing for e-commerce (6thStreet.com), customer behavior analytics in-store, and optimizing supply chain logistics."
    },
    {
        "name": "Union Coop",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "retail",
        "website": "https://www.unioncoop.ae",
        "description": "A leading consumer cooperative in the UAE, operating hypermarkets and shopping centers. It is well-regarded for its competitive pricing and focus on serving the local community.",
        "address": "P.O. Box 777, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/unioncoop/" }
        ],
        "ai_use_case": "Opportunities: AI-powered inventory management to reduce waste, analysis of shopper data to optimize product placement, personalized promotions through its loyalty program, and demand forecasting for fresh produce."
    },
    {
        "name": "noon",
        "country": "uae",
        "location": "dubai",
        "size": "medium",
        "priority": "emerging",
        "sector": "retail",
        "website": "https://www.noon.com",
        "description": "A leading e-commerce platform in the Middle East, offering a wide assortment of products including electronics, fashion, beauty, and groceries. It has a strong logistics and fulfillment network.",
        "address": "Emaar Business Park, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/nooncom/" }
        ],
        "ai_use_case": "Opportunities: AI-driven product recommendation engines, optimizing last-mile delivery routes, dynamic pricing based on competitor data, and AI-powered chatbots for customer service."
    },
    {
        "name": "PureHealth",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "healthcare",
        "website": "https://purehealth.ae",
        "description": "The largest integrated healthcare platform in the Middle East, managing a network of over 25 hospitals, 100 clinics, and multiple diagnostic centers, including SEHA, Daman, and The Medical Office.",
        "address": "Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/purehealth/" }
        ],
        "ai_use_case": "Opportunities: AI for population health management, predictive analytics for disease outbreaks, optimizing hospital operations and patient flow, automating insurance claims processing, and supporting clinical decisions with data analysis."
    },
    {
        "name": "G42 Healthcare",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "healthcare",
        "website": "https://www.g42healthcare.ai",
        "description": "A leading AI-powered healthcare technology company focused on genomics, diagnostics, and personalized medicine. It played a key role in the UAE's pandemic response and continues to drive innovation in life sciences.",
        "address": "Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/g42-healthcare/" }
        ],
        "ai_use_case": "Opportunities: AI-driven genomic sequencing and analysis, developing diagnostic tools using machine learning, drug discovery and development, and creating large-scale health data platforms for research and clinical trials."
    },
    {
        "name": "Aster DM Healthcare",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "healthcare",
        "website": "https://www.asterdmhealthcare.com",
        "description": "One of the largest private healthcare service providers in the GCC and India, with a network of hospitals, clinics, and pharmacies offering a comprehensive range of medical services.",
        "address": "P.O. Box 8703, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/asterdmhealthcare/" }
        ],
        "ai_use_case": "Opportunities: AI for optimizing patient flow across its network, automating appointment scheduling and reminders, intelligent processing of insurance claims, and providing preliminary diagnostic support through telehealth platforms."
    },
    {
        "name": "Julphar",
        "country": "uae",
        "location": "rasalkhaimah",
        "size": "large",
        "priority": "medium",
        "sector": "healthcare",
        "website": "https://www.julphar.net",
        "description": "One of the largest pharmaceutical manufacturers in the Middle East and Africa. Julphar produces a wide range of medicines, including antibiotics, cardiovascular drugs, and diabetes treatments, distributing to over 50 countries.",
        "address": "P.O. Box 997, Ras Al Khaimah, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/julphar/" }
        ],
        "ai_use_case": "Opportunities: AI in drug discovery and development, optimizing manufacturing processes for yield and quality, predictive maintenance for production lines, and improving supply chain management and forecasting."
    },
    {
        "name": "Cleveland Clinic Abu Dhabi",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "healthcare",
        "website": "https://www.clevelandclinicabudhabi.ae",
        "description": "A multispecialty hospital that is a direct extension of the US-based Cleveland Clinic. It offers a range of tertiary/quaternary medical services, setting a new standard for complex care in the region.",
        "address": "Al Maryah Island, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/cleveland-clinic-abu-dhabi/" }
        ],
        "ai_use_case": "Opportunities: AI-assisted analysis of medical imaging (radiology, pathology), predictive models for patient outcomes and risk stratification, optimizing operating room scheduling, and personalizing patient care pathways."
    },
    {
        "name": "NMC Healthcare",
        "country": "oman",
        "location": "muscat",
        "size": "medium",
        "priority": "medium",
        "sector": "healthcare",
        "website": "https://nmc.om/",
        "description": "One of the largest private healthcare providers in Oman, operating a network of hospitals, medical centers, and pharmacies across the country.",
        "address": "NMC Specialty Hospital, Al Ghoubra, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/nmc-healthcare" }
        ],
        "ai_use_case": "Opportunities: Patient appointment scheduling automation, optimizing hospital bed allocation, insurance claims processing, and personalized patient care plans."
    },
    {
        "name": "Sultan Qaboos University Hospital",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "healthcare",
        "website": "https://www.squ.edu.om/medicine/squh",
        "description": "Tertiary healthcare services, medical education, research, and specialized medical treatments with comprehensive medical facilities.",
        "address": "Sultan Qaboos University, P.O. Box 38, PC 123, Al Khoudh, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/school/sultan-qaboos-university" }
        ],
        "ai_use_case": "Opportunities: Patient management, diagnosis support, resource optimization, medical research analytics"
    },
    {
        "name": "Dhofar Insurance Company",
        "country": "oman",
        "location": "muscat",
        "size": "medium",
        "priority": "medium",
        "sector": "healthcare",
        "website": "https://www.dhofarinsurance.com",
        "description": "A leading insurance company in Oman, providing a wide range of products including motor, marine, fire, engineering, and health insurance.",
        "address": "P.O. Box 2475, Ruwi, PC 112, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/dhofar-insurance-co--s-a-o-g" }
        ],
        "ai_use_case": "Opportunities: Automating claims assessment and processing, AI-powered risk analysis for underwriting, detecting fraudulent claims, and customer service chatbots for policy inquiries."
    },
    {
        "name": "Oman Insurance Company",
        "country": "oman",
        "location": "muscat",
        "size": "medium",
        "priority": "high",
        "sector": "healthcare",
        "website": "https://www.omaninsurance.com",
        "description": "General insurance, life insurance, health insurance, marine insurance, and risk management solutions with comprehensive coverage.",
        "address": "Oman Insurance Building, P.O. Box 685, PC 112, Ruwi, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oman-insurance-company" }
        ],
        "ai_use_case": "Opportunities: Claims processing automation, underwriting optimization, customer service enhancement, risk assessment"
    },
    {
        "name": "Aster Al Raffah Hospitals & Clinics",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "healthcare",
        "website": "https://asteroman.com",
        "description": "Part of the Aster DM Healthcare group, this network is one of the largest private healthcare providers in Oman, offering a comprehensive range of medical services through its hospitals and clinics.",
        "address": "Ghala, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/aster-al-raffah-hospitals-&-clinics-oman/" }
        ],
        "ai_use_case": "Opportunities: AI for patient flow optimization in clinics, automating appointment scheduling and reminders, intelligent processing of insurance claims, and providing preliminary diagnostic support."
    },
    {
        "name": "Burjeel Hospital, Muscat",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "healthcare",
        "website": "https://burjeelhospitaloman.com",
        "description": "A leading private tertiary care hospital offering a wide range of specialized medical treatments, diagnostics, and surgical services with a focus on a premium patient experience.",
        "address": "Al Khuwair, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/burjeel-medical-services-oman-and-al-futtaim/" }
        ],
        "ai_use_case": "Opportunities: AI-assisted medical imaging analysis, predictive analytics for patient outcomes, optimizing operating room scheduling, and personalizing patient care pathways and communication."
    },
    {
        "name": "KIMSHEALTH Oman",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "healthcare",
        "website": "https://www.kimshealth.om",
        "description": "A multispecialty hospital providing comprehensive healthcare services since 2009. KIMSHEALTH has a network that includes a hospital in Muscat and medical centers in other locations.",
        "address": "Darsait, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/showcase/kims-oman-hospital/" }
        ],
        "ai_use_case": "Opportunities: Automating patient record management, AI-driven tools for clinical decision support, workforce management for medical staff, and analysis of patient feedback for service improvement."
    },
    {
        "name": "Badr Al Samaa Group of Hospitals",
        "country": "oman",
        "location": "multiple",
        "size": "large",
        "priority": "high",
        "sector": "healthcare",
        "website": "https://badralsamaahospitals.com",
        "description": "The largest private healthcare group in Oman, with a vast network of hospitals and polyclinics across the Sultanate and GCC, serving a high volume of patients.",
        "address": "Head Office in Ruwi, with branches in Al Khoud, Sohar, Salalah, and more.",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/badr-al-samaa-group-of-hospitals-polyclinics/" }
        ],
        "ai_use_case": "Opportunities: Centralized AI platform for managing patient data across all branches, optimizing inventory of medical supplies, intelligent triaging of patients in emergency rooms, and fraud detection in billing and claims."
    },
    {
        "name": "Al Ahlia Insurance",
        "country": "oman",
        "location": "muscat",
        "size": "medium",
        "priority": "emerging",
        "sector": "healthcare",
        "website": "https://www.alahliaoman.com/",
        "description": "A leading insurance provider in Oman, offering a wide range of products for individuals and businesses, including motor, health, travel, and property insurance, with a strong focus on digital services.",
        "address": "Wattayah, P.O.Box 1461, PC 112, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-ahlia-insurance-co-saog-oman/" }
        ],
        "ai_use_case": "Opportunities: Automating insurance claims processing using image recognition (for auto damage), AI-powered chatbots for customer queries, personalized insurance premium pricing, and proactive risk mitigation advice for clients."
    },
    {
        "name": "Dubai Health Authority (DHA)",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "healthcare",
        "website": "https://www.dha.gov.ae",
        "description": "The government body overseeing the health system in Dubai. It provides healthcare services through its hospitals and facilities and is responsible for regulating the health sector in the emirate.",
        "address": "P.O. Box 4545, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/dubai-health-authority/" }
        ],
        "ai_use_case": "Opportunities: AI for population health management and predicting disease outbreaks, optimizing resource allocation across public hospitals, automating health insurance claim approvals, and AI-powered diagnostic tools."
    },
    {
        "name": "G42",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "it-technology",
        "website": "https://www.g42.ai",
        "description": "An artificial intelligence and cloud computing company at the forefront of the UAE's digital transformation. It operates across various sectors, including healthcare, smart cities, finance, and oil and gas.",
        "address": "Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/g42/" }
        ],
        "ai_use_case": "Opportunities: Development and deployment of large-scale AI models, providing AI-as-a-Service (AIaaS) through its cloud platform, advancing research in AI ethics and safety, and pioneering AI applications for government and enterprise clients."
    },
    {
        "name": "TECOM Group",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "it-technology",
        "website": "https://www.tecomgroup.ae",
        "description": "A strategic business enabler that has established and manages 10 business districts in Dubai, including Dubai Internet City, Dubai Media City, and Dubai Design District, hosting over 7,800 companies.",
        "address": "P.O. Box 73000, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/tecomgroupdubai/" }
        ],
        "ai_use_case": "Opportunities: AI for smart city management within its districts, providing AI-powered services to tenants, optimizing traffic flow and resource allocation, and fostering an AI ecosystem by attracting and supporting tech startups."
    },
    {
        "name": "Careem",
        "country": "uae",
        "location": "dubai",
        "size": "medium",
        "priority": "emerging",
        "sector": "it-technology",
        "website": "https://www.careem.com/",
        "description": "The region's leading 'everything app' offering a wide range of services including ride-hailing, food delivery, payments, and more. A subsidiary of Uber, it is a pioneer in the region's tech scene.",
        "address": "Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/careem/" }
        ],
        "ai_use_case": "Opportunities: AI for optimizing driver-rider matching and dispatch algorithms, dynamic pricing models based on demand and supply, personalizing user experience and promotions, and route optimization for food delivery services."
    },
    {
        "name": "Bahwan CyberTek (BCT)",
        "country": "oman",
        "location": "muscat",
        "size": "medium",
        "priority": "high",
        "sector": "it-technology",
        "website": "https://www.bahwancybertek.com",
        "description": "A global provider of digital transformation solutions, specializing in predictive analytics, digital experience, and supply chain optimization for industries like oil & gas, banking, and government.",
        "address": "Building No 2878/1, Phase-2, Bushar – Madinat Qaboos, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/bahwan-cybertek" },
            { "name": "Twitter", "url": "https://twitter.com/bahwancybertek" }
        ],
        "ai_use_case": "Opportunities: Development of AI-powered enterprise solutions, AI consulting services, implementation of machine learning models for business intelligence, and automation of IT operations."
    },
    {
        "name": "Data Mount",
        "country": "oman",
        "location": "muscat",
        "size": "medium",
        "priority": "high",
        "sector": "it-technology",
        "website": "https://www.datamount.om",
        "description": "Oman's largest commercial data center, providing co-location, cloud services, and managed IT services. It is a critical component of Oman's digital transformation infrastructure.",
        "address": "Jabal Al Akhdar, Al Dakhiliyah Governorate, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/datamount/" }
        ],
        "ai_use_case": "Opportunities: AI-driven data center infrastructure management (DCIM), automated cybersecurity threat detection, resource allocation optimization for cloud services, and providing AI-as-a-Service (AIaaS) to tenants."
    },
    {
        "name": "Jumbo Electronics",
        "country": "uae",
        "location": "dubai",
        "size": "medium",
        "priority": "medium",
        "sector": "it-technology",
        "website": "https://www.jumbo.ae",
        "description": "A leading distributor and retailer of consumer electronics and IT products in the UAE. It offers a wide range of products from major international brands through its stores and online platform.",
        "address": "P.O. Box 3426, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/jumbo-electronics-co--ltd--llc-/" }
        ],
        "ai_use_case": "Opportunities: AI-powered product recommendations for e-commerce, demand forecasting for consumer electronics, optimizing inventory across retail locations, and chatbots for customer support and product queries."
    },
    {
        "name": "Sharaf DG",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "it-technology",
        "website": "https://www.sharafdg.com",
        "description": "One of the leading electronics retailers in the UAE, offering a wide range of products including electronics, home appliances, and IT products. Part of the diversified Sharaf Group.",
        "address": "P.O. Box 2913, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/sharaf-dg/" }
        ],
        "ai_use_case": "Opportunities: Dynamic pricing based on market trends, AI for personalized customer promotions, optimizing stock levels in large-format stores, and enhancing the online shopping experience with virtual assistants."
    },
    {
        "name": "Abu Dhabi Media (ADM)",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "medium",
        "sector": "media-publishing",
        "website": "https://www.admedia.ae",
        "description": "A leading public service broadcaster and media company in the UAE and the region, with a diversified portfolio of television channels, radio stations, newspapers, and digital platforms.",
        "address": "P.O. Box 63, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/abudhabimedia/" }
        ],
        "ai_use_case": "Opportunities: AI for content personalization and recommendation engines, automating video tagging and metadata creation, audience sentiment analysis, and optimizing advertising placements for maximum impact."
    },
    {
        "name": "Muscat Media Group",
        "country": "oman",
        "location": "muscat",
        "size": "medium",
        "priority": "emerging",
        "sector": "media-publishing",
        "website": "https://www.muscatmediagroup.com",
        "description": "The largest media house in Oman, publishing leading newspapers like the Times of Oman and Al Shabiba. They also have a strong digital presence, radio stations, and printing services. [22]",
        "address": "P.O. Box 770, PC 112, Ruwi, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/muscat-media-group" },
            { "name": "Twitter", "url": "https://twitter.com/timesofoman" }
        ],
        "ai_use_case": "Opportunities: Automated news tagging and categorization, personalized content recommendation for readers, programmatic advertising optimization, and sentiment analysis of public opinion on news articles."
    },
    {
        "name": "GEMS Education",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "high",
        "sector": "education",
        "website": "https://www.gemseducation.com",
        "description": "One of the world's largest private K-12 education providers, operating a global network of schools with a focus on delivering high-quality education and fostering innovation in learning.",
        "address": "P.O. Box 8607, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/gems-education/" }
        ],
        "ai_use_case": "Opportunities: Developing personalized learning paths for students, AI-powered tutoring systems, automating administrative tasks for school operations, and using analytics to improve educational outcomes through its Global Education AI Hub."
    },
    {
        "name": "Sultan Qaboos University",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "education",
        "website": "https://www.squ.edu.om",
        "description": "Higher education, research, medical education, and academic programs with comprehensive university services and facilities.",
        "address": "Sultan Qaboos University, P.O. Box 36, PC 123, Al Khoudh, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/school/sultan-qaboos-university" }
        ],
        "ai_use_case": "Opportunities: Student services automation, research analytics, campus management, academic administration"
    },
    {
        "name": "Agthia Group",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "medium",
        "sector": "food-beverage",
        "website": "https://www.agthia.com",
        "description": "A leading food and beverage company in the region, managing a world-class portfolio of brands in water, snacking, protein, and agri-business, including Al Ain Water and Al Foah Dates.",
        "address": "P.O. Box 37725, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/agthia-group/" }
        ],
        "ai_use_case": "Opportunities: AI to enhance customer service for home delivery, demand forecasting for CPG products, optimizing production and procurement, and establishing smart retail stores with digital solutions."
    },
    {
        "name": "A'Saffa Foods",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "food-beverage",
        "website": "https://www.asaffafoods.com/",
        "description": "Oman's largest fully integrated poultry producer, also offering other food products. They are known for their high-quality, naturally fed chickens and food products.",
        "address": "A'Saffa House, Way No. 44, Block No. 234, North Azaiba, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/a-saffa-foods-saog/" },
            { "name": "Instagram", "url": "https://www.instagram.com/asaffa_foods/" }
        ],
        "ai_use_case": "Opportunities: Demand forecasting, supply chain optimization, production planning and scheduling, quality control through computer vision, and livestock health monitoring."
    },
    {
        "name": "Oman Flour Mills",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "food-beverage",
        "website": "https://www.omanflourmills.com",
        "description": "A major food processing company in Oman, specializing in flour, feed, and other food products. They play a vital role in the nation's food security. [5]",
        "address": "P.O. Box 146, Ruwi, PC 112, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oman-flour-mills-co-saog" }
        ],
        "ai_use_case": "Opportunities: Commodity price prediction, production yield optimization, automated quality assessment of grains, and distribution route planning."
    },
    {
        "name": "Oman Refreshment Company",
        "country": "oman",
        "location": "muscat",
        "size": "medium",
        "priority": "emerging",
        "sector": "food-beverage",
        "website": "https://www.pepsioman.com",
        "description": "The franchisee and distributor for PepsiCo products in Oman. The company has an extensive distribution network covering all parts of the country. [5]",
        "address": "Ghala Industrial Area, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oman-refreshment-co-ltd-saog" }
        ],
        "ai_use_case": "Opportunities: Demand forecasting for different beverage products, sales route optimization, vending machine stock monitoring, and trade marketing automation."
    },
    {
        "name": "Bin Mirza International",
        "country": "oman",
        "location": "multiple",
        "size": "medium",
        "priority": "emerging",
        "sector": "food-beverage",
        "website": "https://www.binmirza.com/",
        "description": "A pioneer in Oman's hospitality industry, introducing and managing leading international food and beverage brands like Second Cup and Wagamama.",
        "address": "Offices and outlets in Muscat and other locations across Oman.",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/bin-mirza-international/" }
        ],
        "ai_use_case": "Opportunities: Customer sentiment analysis from feedback, optimizing staff scheduling, personalizing marketing offers, and managing inventory across multiple locations."
    },
    {
        "name": "Oman Fisheries Co. SAOG",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "food-beverage",
        "website": "https://www.omanfisheries.com",
        "description": "A leader in Oman's fishing industry, involved in the procurement, processing, and export of fresh and frozen fish and seafood products. They play a key role in the nation's food security and export economy.",
        "address": "Al-Falaj Street, Ruwi, P.O. Box 2900, PC 112, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oman-fisheries-co-saog/" }
        ],
        "ai_use_case": "Opportunities: Predicting fish catch volumes and locations, optimizing fishing fleet routes and fuel consumption, AI-powered quality control in processing plants, and managing export logistics."
    },
    {
        "name": "Saud Bahwan Group",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "automotive",
        "website": "https://www.saudbahwangroup.com",
        "description": "A massive automotive distributor representing world-class brands like Toyota, Lexus, Ford, and Kia. They also have interests in heavy vehicles, construction equipment, and real estate. [39]",
        "address": "P.O. Box 3168, Ruwi, PC 112, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/saud-bahwan-group" }
        ],
        "ai_use_case": "Opportunities: Vehicle sales forecasting, customer service automation for service centers, spare parts inventory optimization, and personalized marketing campaigns."
    },
    {
        "name": "Mohsin Haider Darwish (MHD)",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "automotive",
        "website": "https://mhd.co.om/",
        "description": "A leading distributor for automotive brands such as Jaguar, Land Rover, and McLaren, as well as engineering products, electronics, and building materials. [13]",
        "address": "MHD Building, Al Khuwair, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/mohsin-haider-darwish-llc" }
        ],
        "ai_use_case": "Opportunities: Lead scoring for high-value vehicles, automating service appointment scheduling, warranty claim processing, and customer relationship management."
    },
    {
        "name": "OTE Group",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "automotive",
        "website": "https://www.otegroup.com",
        "description": "A highly diversified business group with a strong presence in the automotive sector, representing brands like Hyundai, Chevrolet, and Isuzu. Also has interests in electronics, tires, and technical training.",
        "address": "Wattayah, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/ote-group/" }
        ],
        "ai_use_case": "Opportunities: Predictive analytics for vehicle maintenance, optimizing spare parts inventory across brands, automating customer service for vehicle inquiries, and lead scoring for potential car buyers."
    },
    {
        "name": "Al Naboodah Group Enterprises",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "automotive",
        "website": "https://www.alnaboodah.com",
        "description": "A major conglomerate with a diverse portfolio, including a significant automotive division that is the sole distributor for brands like Peugeot, Porsche, and Audi in Dubai and the Northern Emirates.",
        "address": "P.O. Box 88, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/al-naboodah-group-enterprises/" }
        ],
        "ai_use_case": "Opportunities: Predictive analytics for vehicle sales trends, optimizing after-sales service scheduling, AI-powered diagnostics for vehicle maintenance, and managing inventory of spare parts."
    },
    {
        "name": "Galadari Brothers",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "automotive",
        "website": "https://www.galadari.com",
        "description": "A diversified group with a strong footing in the automotive sector as the distributor for Mazda in the UAE. They are also involved in media (Khaleej Times), hospitality, and industrial equipment.",
        "address": "P.O. Box 138, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/galadari-brothers-group/" }
        ],
        "ai_use_case": "Opportunities: AI-driven customer segmentation for targeted marketing, automating vehicle service appointments, sales forecasting for new and used cars, and optimizing inventory for their heavy equipment division."
    },
    {
        "name": "AW Rostamani Group",
        "country": "uae",
        "location": "dubai",
        "size": "large",
        "priority": "medium",
        "sector": "automotive",
        "website": "https://www.awrostamani.com",
        "description": "A major conglomerate with a strong presence in the automotive sector, as the exclusive distributor for Nissan, INFINITI, and Renault in Dubai and the Northern Emirates. Also active in real estate and retail.",
        "address": "P.O. Box 222, Dubai, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/aw-rostamani-group/" }
        ],
        "ai_use_case": "Opportunities: Predictive analytics for vehicle sales and after-sales services, AI-powered customer service for appointment booking, optimizing spare parts inventory, and personalized marketing for new car models."
    },
    {
        "name": "OMZEST (Omar Zawawi Establishment)",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "utilities",
        "website": "https://www.omzest.com",
        "description": "A diversified group with strong presence in utilities, particularly in power generation and water treatment projects. Also has interests in construction, manufacturing, and services. [7]",
        "address": "P.O. Box 879, Muscat 100, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/omzest" }
        ],
        "ai_use_case": "Opportunities: Predictive maintenance for power and water plants, optimizing plant operational efficiency, load forecasting for electricity demand, and managing water resources effectively."
    },
    {
        "name": "Nama Group",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "utilities",
        "website": "https://www.nama.om",
        "description": "The holding company for a group of government-owned electricity and water service providers in Oman, responsible for generation, transmission, and distribution.",
        "address": "Beach One Building, Shatti Al Qurum, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/nama-group-oman/" }
        ],
        "ai_use_case": "Opportunities: Smart grid management, demand-side response programs, predictive analytics for asset failure, and optimizing energy trading and dispatch."
    },
    {
        "name": "Omran Group",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "tourism",
        "website": "https://www.omran.om",
        "description": "Oman's executive arm for tourism development, responsible for delivering major projects, including hotels, resorts, and integrated tourism complexes, to boost the country's tourism sector.",
        "address": "Madinat Al Irfan, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/omran-oman-tourism-development-company-/" }
        ],
        "ai_use_case": "Opportunities: Analysis of tourism trends to guide investment, personalized guest experiences in its hotels, optimizing hotel operations and revenue management, and sustainable tourism planning."
    },
    {
        "name": "Muriya Tourism Development",
        "country": "oman",
        "location": "salalah",
        "size": "large",
        "priority": "high",
        "sector": "tourism",
        "website": "https://www.muriya.om",
        "description": "A major developer of integrated tourism complexes (ITCs) in Oman, including Hawana Salalah and Jebel Sifah. Their projects combine hotels, real estate, marinas, and recreational facilities.",
        "address": "Hawana Salalah, P.O. Box 802, PC 215, Salalah, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/muriya/" }
        ],
        "ai_use_case": "Opportunities: AI-driven personalized guest experiences, dynamic pricing for hotels and real estate, optimizing resort operations and energy consumption, and targeted international marketing campaigns."
    },
    {
        "name": "Telecommunications and Digital Government Regulatory Authority (TDRA)",
        "country": "uae",
        "location": "multiple",
        "size": "large",
        "priority": "high",
        "sector": "government",
        "website": "https://www.tdra.gov.ae",
        "description": "The federal authority responsible for regulating the telecommunications sector and enabling digital transformation in the UAE government. It oversees the country's digital infrastructure and services.",
        "address": "Offices in Abu Dhabi and Dubai.",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/tdrauae/" }
        ],
        "ai_use_case": "Opportunities: AI for spectrum management and monitoring, automating regulatory compliance checks, analyzing cybersecurity threats to national infrastructure, and developing policies for AI governance and data privacy."
    },
    {
        "name": "Tabreed",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "medium",
        "sector": "utilities",
        "website": "https://www.tabreed.ae",
        "description": "A leading international district cooling company that provides energy-efficient, cost-effective, and environmentally friendly cooling solutions to government, commercial, and residential projects.",
        "address": "Masdar City, P.O. Box 29478, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/tabreed/" }
        ],
        "ai_use_case": "Opportunities: AI to optimize plant performance and align cooling production with real-time demand, predictive maintenance for the cooling network, and enhancing energy efficiency to reduce grid pressure and carbon emissions."
    },
    {
        "name": "Oman Power and Water Procurement Company (OPWP)",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "utilities",
        "website": "https://www.omanpwp.co.om",
        "description": "The single buyer of power and desalinated water from independent producers in Oman. It is responsible for securing production capacity and managing the balance between electricity demand and supply. [7]",
        "address": "P.O. Box 1388, PC 112, Ruwi, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/oman-power-and-water-procurement-company-opwp-" }
        ],
        "ai_use_case": "Opportunities: Long-term demand forecasting for power and water, optimizing procurement from power plants, modeling grid stability, and planning for renewable energy integration."
    },
    {
        "name": "Veolia Oman",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "utilities",
        "website": "https://www.veolia.com/middle-east/oman",
        "description": "A global leader in optimized resource management, operating in Oman with a focus on water management, waste management, and energy services for municipal and industrial clients. [17]",
        "address": "Locations in Muscat, Sur, and other operational sites.",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/veolia" }
        ],
        "ai_use_case": "Opportunities: Optimizing waste collection routes, predictive maintenance for water treatment plants, smart water grid management to detect leaks, and energy efficiency solutions for industrial clients."
    },
    {
        "name": "ACWA Power Oman",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "utilities",
        "website": "https://www.acwapower.com",
        "description": "Power generation, renewable energy projects, desalination, and utility development with focus on sustainable energy solutions.",
        "address": "Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/acwa-power" }
        ],
        "ai_use_case": "Opportunities: Renewable energy optimization, plant operations automation, energy trading, maintenance scheduling"
    },
    {
        "name": "Mazoon Electricity Company",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "medium",
        "sector": "utilities",
        "website": "https://www.mzec.co.om",
        "description": "A key electricity distribution and supply company in Oman, serving several governorates. It is part of the Nama Group and focuses on providing reliable power to its customers.",
        "address": "P.O. Box 113, PC 131, Seeb, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/mazoonelectricity/" }
        ],
        "ai_use_case": "Opportunities: AI for smart grid management to reduce power losses, predicting electricity demand in different regions, predictive maintenance for distribution networks, and automating customer billing inquiries."
    },
    {
        "name": "Sharjah Electricity, Water and Gas Authority (SEWA)",
        "country": "uae",
        "location": "sharjah",
        "size": "large",
        "priority": "high",
        "sector": "utilities",
        "website": "https://www.sewa.gov.ae",
        "description": "The exclusive provider of electricity, water, and natural gas services in the Emirate of Sharjah. SEWA is focused on ensuring the reliability and sustainability of utility services.",
        "address": "P.O. Box 2, Sharjah, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/sewgov/" }
        ],
        "ai_use_case": "Opportunities: AI for managing utility grids and predicting demand, predictive maintenance for power plants and water desalination facilities, smart meter data analytics, and customer service automation."
    },
    {
        "name": "InterContinental Muscat",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "tourism",
        "website": "https://www.ihg.com/intercontinental/hotels/us/en/muscat/mctna/hoteldetail",
        "description": "Luxury hotel accommodation, dining, meetings and events, spa services, and hospitality management with premium guest services.",
        "address": "Al Khuwayr, P.O. Box 398, PC 133, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/intercontinental-hotels-group" },
            { "name": "Instagram", "url": "https://www.instagram.com/intercontinentalmuscat" }
        ],
        "ai_use_case": "Opportunities: Concierge services automation, revenue optimization, guest personalization, predictive maintenance"
    },
    {
        "name": "Ministry of Transport",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "government",
        "website": "https://www.mot.gov.om",
        "description": "Transportation infrastructure, aviation regulation, maritime services, and logistics planning with comprehensive transport management.",
        "address": "Ministry of Transport, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/ministry-of-transport-oman" }
        ],
        "ai_use_case": "Opportunities: Traffic management, public transport optimization, licensing automation, infrastructure planning"
    },
    {
        "name": "Royal Oman Police",
        "country": "oman",
        "location": "muscat",
        "size": "large",
        "priority": "high",
        "sector": "government",
        "website": "https://www.rop.gov.om",
        "description": "Law enforcement, public safety, traffic management, and security services with comprehensive policing and emergency response.",
        "address": "Royal Oman Police HQ, Muscat, Sultanate of Oman",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/royal-oman-police" },
            { "name": "Twitter", "url": "https://twitter.com/RoyalOmanPolice" }
        ],
        "ai_use_case": "Opportunities: Crime analytics, traffic monitoring, emergency response optimization, public safety management"
    },
    {
        "name": "Tawazun Council",
        "country": "uae",
        "location": "abudhabi",
        "size": "large",
        "priority": "high",
        "sector": "government",
        "website": "https://www.tawazun.ae",
        "description": "The UAE's defence and security acquisitions authority, responsible for managing procurement and enabling the defence industry. It plays a crucial role in the country's strategic industrial development.",
        "address": "P.O. Box 5254, Abu Dhabi, UAE",
        "social": [
            { "name": "LinkedIn", "url": "https://www.linkedin.com/company/tawazun-council/" }
        ],
        "ai_use_case": "Opportunities: AI for analyzing defence technology trends, optimizing procurement processes, managing complex supply chains for the defence sector, and modeling strategic security scenarios."
    }
];

const sectorIcons = {
    "investment-finance": "💰",
    "holding-groups": "🌐",
    "energy": "⚡",
    "logistics": "🚢",
    "aviation": "✈️",
    "telecommunications": "📱",
    "real-estate-construction": "🏗️",
    "industrial-manufacturing": "🏭",
    "retail": "🛒",
    "healthcare": "🏥",
    "food-beverage": "🍽️",
    "it-technology": "💻",
    "media-publishing": "📰",
    "education": "🎓",
    "automotive": "🚗",
    "utilities": "💡",
    "tourism": "🏨",
    "government": "🏛️"
};

const countryDisplayNames = {
    uae: "🇦🇪 UAE",
    oman: "🇴🇲 Oman"
};

// Create the companiesData object structure expected by the script
const companiesData = {
    filters: {
        sectors: [
            { value: "investment-finance", label: "💰 Investment & Finance" },
            { value: "holding-groups", label: "🌐 Holding Groups" },
            { value: "energy", label: "⚡ Energy" },
            { value: "logistics", label: "🚢 Logistics" },
            { value: "aviation", label: "✈️ Aviation" },
            { value: "telecommunications", label: "📱 Telecommunications" },
            { value: "real-estate-construction", label: "🏗️ Real Estate & Construction" },
            { value: "industrial-manufacturing", label: "🏭 Industrial & Manufacturing" },
            { value: "retail", label: "🛒 Retail" },
            { value: "healthcare", label: "🏥 Healthcare" },
            { value: "food-beverage", label: "🍽️ Food & Beverage" },
            { value: "it-technology", label: "💻 IT & Technology" },
            { value: "media-publishing", label: "📰 Media & Publishing" },
            { value: "education", label: "🎓 Education" },
            { value: "automotive", label: "🚗 Automotive" },
            { value: "utilities", label: "💡 Utilities" },
            { value: "tourism", label: "🏨 Tourism" },
            { value: "government", label: "🏛️ Government" }
        ],
        locations: [
            { value: "abudhabi", label: "Abu Dhabi" },
            { value: "dubai", label: "Dubai" },
            { value: "sharjah", label: "Sharjah" },
            { value: "rasalkhaimah", label: "Ras Al Khaimah" },
            { value: "muscat", label: "Muscat" },
            { value: "sohar", label: "Sohar" },
            { value: "salalah", label: "Salalah" },
            { value: "sur", label: "Sur" },
            { value: "duqm", label: "Duqm" },
            { value: "rusayl", label: "Rusayl" },
            { value: "multiple", label: "Multiple Locations" }
        ],
        sizes: [
            { value: "large", label: "Large Enterprise" },
            { value: "medium", label: "Medium Enterprise" },
            { value: "small", label: "Small/Medium Enterprise" }
        ]
    },
    sectors: {}
};

// Organize companies by sector
companies.forEach(company => {
    const sector = company.sector;
    if (!companiesData.sectors[sector]) {
        companiesData.sectors[sector] = {
            name: companiesData.filters.sectors.find(s => s.value === sector)?.label || sector,
            icon: sectorIcons[sector] || "🏢",
            companies: []
        };
    }
    
    // Transform company data to match expected format
    const transformedCompany = {
        name: company.name,
        country: company.country,
        location: company.location,
        size: company.size,
        priority: company.priority,
        website: company.website,
        services: company.description,
        address: company.address,
        socialLinks: company.social ? company.social.reduce((acc, link) => {
            acc[link.name.toLowerCase()] = link.url;
            return acc;
        }, {}) : {},
        aiUseCase: company.ai_use_case
    };
    
    companiesData.sectors[sector].companies.push(transformedCompany);
});