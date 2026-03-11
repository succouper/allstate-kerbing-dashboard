import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

const TENDERS = [{"id": 1, "name": "Displacement Mitigation of Concrete Footpaths", "location": "Brisbane City Council, Brisbane-wide", "builder": "Brisbane City Council", "budget": "Undisclosed", "budgetMin": 0, "budgetMax": 0, "distance": "Brisbane-wide", "distanceKm": 60, "category": "Civil", "closes": "23 Mar 2026", "closesSort": 20260323, "region": "Brisbane", "tenderSite": "SAP Ariba", "tenderType": "RFP", "kerbRelevance": "Direct — concrete grinding/footpath works", "urgent": false, "gc": false}, {"id": 2, "name": "TMR Burleigh Connection Rd Bus Infrastructure", "location": "Burleigh Connection Road, Burleigh Waters QLD", "builder": "Hazell Bros", "budget": "$4m–$5m", "budgetMin": 4, "budgetMax": 5, "distance": "11 km", "distanceKm": 11, "category": "Civil", "closes": "4 Mar 2026", "closesSort": 20260304, "region": "Gold Coast", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Direct — road infrastructure", "urgent": true, "gc": true}, {"id": 3, "name": "T3551 TMR Burleigh Conn Rd & Varsity Lakes Bus Upgrades", "location": "Reedy Creek Road, Burleigh Waters QLD", "builder": "Bellwether", "budget": "$3m–$4m", "budgetMin": 3, "budgetMax": 4, "distance": "11 km", "distanceKm": 11, "category": "Civil", "closes": "5 Mar 2026", "closesSort": 20260305, "region": "Gold Coast", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Direct — road/bus infrastructure", "urgent": true, "gc": true}, {"id": 4, "name": "The Gold Coast Turf Club — The Meadows", "location": "Racecourse Drive, Bundall QLD", "builder": "GorisCo / McNab / JMAC", "budget": "$15m–$20m", "budgetMin": 15, "budgetMax": 20, "distance": "1 km", "distanceKm": 1, "category": "Commercial", "closes": "5 Mar 2026", "closesSort": 20260305, "region": "Gold Coast", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils package", "urgent": true, "gc": true}, {"id": 5, "name": "Gold Coast Turf Club", "location": "Racecourse Drive, Bundall QLD", "builder": "Higgins", "budget": "$10m–$15m", "budgetMin": 10, "budgetMax": 15, "distance": "1 km", "distanceKm": 1, "category": "Commercial", "closes": "5 Mar 2026", "closesSort": 20260305, "region": "Gold Coast", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils package", "urgent": true, "gc": true}, {"id": 6, "name": "BAC Skygate Play", "location": "Brisbane Airport QLD", "builder": "Xenia / McNab / Hutchinson", "budget": "$20m–$30m", "budgetMin": 20, "budgetMax": 30, "distance": "73 km", "distanceKm": 73, "category": "Commercial", "closes": "5 Mar 2026", "closesSort": 20260305, "region": "Brisbane", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — car park/external works", "urgent": true, "gc": false}, {"id": 7, "name": "McDonalds Cairns North New Build", "location": "369 Sheridan Street, Cairns North QLD", "builder": "Prolan", "budget": "$3m–$4m", "budgetMin": 3, "budgetMax": 4, "distance": "1462 km", "distanceKm": 1462, "category": "Commercial", "closes": "5 Mar 2026", "closesSort": 20260305, "region": "Far North QLD", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — car park kerbing", "urgent": true, "gc": false}, {"id": 8, "name": "UQ Union Complex Redevelopment – Stage 1", "location": "Union Road, St Lucia QLD", "builder": "Mettle / ADCO / FDC / SHAPE", "budget": "$50m–$100m", "budgetMin": 50, "budgetMax": 100, "distance": "68 km", "distanceKm": 68, "category": "Education", "closes": "5 Mar 2026", "closesSort": 20260305, "region": "Brisbane", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — external works", "urgent": true, "gc": false}, {"id": 9, "name": "43 Grant Ave Hope Island — Townhouse", "location": "43 Grant Avenue, Hope Island QLD", "builder": "Creation Homes", "budget": "$750k–$1m", "budgetMin": 0.75, "budgetMax": 1, "distance": "15 km", "distanceKm": 15, "category": "Residential", "closes": "6 Mar 2026", "closesSort": 20260306, "region": "Gold Coast", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — driveway/site kerbing", "urgent": true, "gc": true}, {"id": 10, "name": "144 Middle St, Cleveland QLD", "location": "144 Middle Street, Cleveland QLD", "builder": "Rapas", "budget": "$20m–$30m", "budgetMin": 20, "budgetMax": 30, "distance": "55 km", "distanceKm": 55, "category": "Residential", "closes": "6 Mar 2026", "closesSort": 20260306, "region": "Redland", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — subdivision kerbing", "urgent": true, "gc": false}, {"id": 11, "name": "6 Fifth Av, Atherton — D&C Social Housing", "location": "6 Fifth Avenue, Atherton QLD", "builder": "Bedford Built", "budget": "$5m–$10m", "budgetMin": 5, "budgetMax": 10, "distance": "1444 km", "distanceKm": 1444, "category": "Government", "closes": "6 Mar 2026", "closesSort": 20260306, "region": "Far North QLD", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils", "urgent": true, "gc": false}, {"id": 12, "name": "QBuild D&C 7 Apartments, Atherton", "location": "6 Fifth Avenue, Atherton QLD", "builder": "Bryant", "budget": "$4m–$5m", "budgetMin": 4, "budgetMax": 5, "distance": "1444 km", "distanceKm": 1444, "category": "Government", "closes": "6 Mar 2026", "closesSort": 20260306, "region": "Far North QLD", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils", "urgent": true, "gc": false}, {"id": 13, "name": "Bargara Shopping Village", "location": "60 Rifle Range Road, Bargara QLD", "builder": "Evolve / ATG Projects / Hutchinson Sunshine", "budget": "$30m–$50m", "budgetMin": 30, "budgetMax": 50, "distance": "363 km", "distanceKm": 363, "category": "Retail", "closes": "7 Mar 2026", "closesSort": 20260307, "region": "Wide Bay", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — car park kerbing", "urgent": false, "gc": false}, {"id": 14, "name": "99 Thorn St Kangaroo Point", "location": "99 Thorn Street, Kangaroo Point QLD", "builder": "Infinitec", "budget": "$30m–$50m", "budgetMin": 30, "budgetMax": 50, "distance": "69 km", "distanceKm": 69, "category": "Residential", "closes": "7 Mar 2026", "closesSort": 20260307, "region": "Brisbane", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils", "urgent": false, "gc": false}, {"id": 15, "name": "T3554 Hoya Road, Boonah — Stage 3 Civil Works", "location": "71 Coronation Drive, Boonah QLD", "builder": "Bellwether", "budget": "$5m–$10m", "budgetMin": 5, "budgetMax": 10, "distance": "71 km", "distanceKm": 71, "category": "Civil", "closes": "10 Mar 2026", "closesSort": 20260310, "region": "Scenic Rim", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Direct — civil road works", "urgent": false, "gc": false}, {"id": 16, "name": "Burton St, Indooroopilly", "location": "8 Burton Street, Indooroopilly QLD", "builder": "Forty4 Projects", "budget": "$5m–$10m", "budgetMin": 5, "budgetMax": 10, "distance": "71 km", "distanceKm": 71, "category": "Residential", "closes": "6 Mar 2026", "closesSort": 20260306, "region": "Brisbane", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site kerbing", "urgent": false, "gc": false}, {"id": 17, "name": "St John Henry Newman College — Stage 2 (Rohrig)", "location": "17 Messines Ridge Road, Tarragindi QLD", "builder": "Rohrig / Herron Coorey / Premis / inSite", "budget": "$3m–$4m", "budgetMin": 3, "budgetMax": 4, "distance": "63 km", "distanceKm": 63, "category": "Education", "closes": "10 Mar 2026", "closesSort": 20260310, "region": "Brisbane", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — external works", "urgent": false, "gc": false}, {"id": 18, "name": "St Patrick's School, St George QLD", "location": "36 Balonne Street, Saint George QLD", "builder": "North Const.", "budget": "$10m–$15m", "budgetMin": 10, "budgetMax": 15, "distance": "474 km", "distanceKm": 474, "category": "Education", "closes": "10 Mar 2026", "closesSort": 20260310, "region": "South West QLD", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — external works", "urgent": false, "gc": false}, {"id": 19, "name": "Elliott St Active Transport & Road Rehab, Caboolture", "location": "Elliott Street, Caboolture QLD", "builder": "Alder", "budget": "$5m–$10m", "budgetMin": 5, "budgetMax": 10, "distance": "112 km", "distanceKm": 112, "category": "Civil", "closes": "9 Mar 2026", "closesSort": 20260309, "region": "Moreton Bay", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Direct — road rehabilitation", "urgent": false, "gc": false}, {"id": 20, "name": "Currumbin Eco-Parkland", "location": "Currumbin Creek Road, Currumbin Waters QLD", "builder": "Hazell Bros", "budget": "$5m–$10m", "budgetMin": 5, "budgetMax": 10, "distance": "18 km", "distanceKm": 18, "category": "Civil", "closes": "10 Mar 2026", "closesSort": 20260310, "region": "Gold Coast", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Direct — civil/parkland works", "urgent": false, "gc": true}, {"id": 21, "name": "St Patrick's School — Staging Multiple Buildings", "location": "36 Balonne Street, St George QLD", "builder": "Boss / NACP Projects / BADGE / Newlands", "budget": "$10m–$15m", "budgetMin": 10, "budgetMax": 15, "distance": "474 km", "distanceKm": 474, "category": "Education", "closes": "10 Mar 2026", "closesSort": 20260310, "region": "South West QLD", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — external works", "urgent": false, "gc": false}, {"id": 22, "name": "D&C DHPW Morayfield Road, Caboolture South — 52x Apts", "location": "28 Morayfield Road, Caboolture South QLD", "builder": "McNab / Woollam / Bedford Built / Paynters", "budget": "$20m–$30m", "budgetMin": 20, "budgetMax": 30, "distance": "111 km", "distanceKm": 111, "category": "Government", "closes": "12 Mar 2026", "closesSort": 20260312, "region": "Moreton Bay", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils", "urgent": false, "gc": false}, {"id": 23, "name": "Goondiwindi Truck Stop Service Station", "location": "2 Lamberth Road, Goondiwindi QLD", "builder": "INSITUGROUP QUEENSLAND", "budget": "$4m–$5m", "budgetMin": 4, "budgetMax": 5, "distance": "309 km", "distanceKm": 309, "category": "Commercial", "closes": "11 Mar 2026", "closesSort": 20260311, "region": "Darling Downs", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — car park kerbing", "urgent": false, "gc": false}, {"id": 24, "name": "T3553 MBCC Elliott St Active Transport Upgrade", "location": "Elliott Street, Caboolture QLD", "builder": "Bellwether", "budget": "$5m–$10m", "budgetMin": 5, "budgetMax": 10, "distance": "112 km", "distanceKm": 112, "category": "Civil", "closes": "11 Mar 2026", "closesSort": 20260311, "region": "Moreton Bay", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Direct — road rehabilitation", "urgent": false, "gc": false}, {"id": 25, "name": "Ozcare RACF Sarina", "location": "18-32 Hoey Street, Sarina QLD", "builder": "Hutchies NQ / Woollam", "budget": "$10m–$15m", "budgetMin": 10, "budgetMax": 15, "distance": "845 km", "distanceKm": 845, "category": "Aged Care", "closes": "12 Mar 2026", "closesSort": 20260312, "region": "Mackay", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — external works", "urgent": false, "gc": false}, {"id": 26, "name": "UQ Gatton — SEQ Animal Science Innovation Hub", "location": "5391 Warrego Highway, Gatton QLD", "builder": "Total Construction", "budget": "$5m–$10m", "budgetMin": 5, "budgetMax": 10, "distance": "117 km", "distanceKm": 117, "category": "Education", "closes": "12 Mar 2026", "closesSort": 20260312, "region": "Lockyer Valley", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — external works", "urgent": false, "gc": false}, {"id": 27, "name": "St John Henry Newman College — Stage 2 (Armstrong)", "location": "17 Messines Ridge Road, Tarragindi QLD", "builder": "Armstrong / inSite", "budget": "$3m–$4m", "budgetMin": 3, "budgetMax": 4, "distance": "63 km", "distanceKm": 63, "category": "Education", "closes": "12 Mar 2026", "closesSort": 20260312, "region": "Brisbane", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — external works", "urgent": false, "gc": false}, {"id": 28, "name": "Currumbin Eco-Parkland (Alder)", "location": "315 Currumbin Creek Road, Currumbin Waters QLD", "builder": "Alder", "budget": "$5m–$10m", "budgetMin": 5, "budgetMax": 10, "distance": "19 km", "distanceKm": 19, "category": "Civil", "closes": "12 Mar 2026", "closesSort": 20260312, "region": "Gold Coast", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Direct — civil/parkland works", "urgent": false, "gc": true}, {"id": 29, "name": "Serenitas Thyme Resort Cairns", "location": "46-48 Reefsedge Way, Kewarra QLD", "builder": "IQ", "budget": "$5m–$10m", "budgetMin": 5, "budgetMax": 10, "distance": "1478 km", "distanceKm": 1478, "category": "Recreation", "closes": "12 Mar 2026", "closesSort": 20260312, "region": "Far North QLD", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils", "urgent": false, "gc": false}, {"id": 30, "name": "YWCA Social Housing — East Toowoomba (McNab)", "location": "112 Mary Street, East Toowoomba QLD", "builder": "McNab", "budget": "$5m–$10m", "budgetMin": 5, "budgetMax": 10, "distance": "151 km", "distanceKm": 151, "category": "Government", "closes": "12 Mar 2026", "closesSort": 20260312, "region": "Toowoomba", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils", "urgent": false, "gc": false}, {"id": 31, "name": "Woolworths Hervey Bay South", "location": "Doolong Road, Kawungan QLD", "builder": "ATG Projects", "budget": "$20m–$30m", "budgetMin": 20, "budgetMax": 30, "distance": "305 km", "distanceKm": 305, "category": "Retail", "closes": "15 Mar 2026", "closesSort": 20260315, "region": "Wide Bay", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — car park kerbing", "urgent": false, "gc": false}, {"id": 32, "name": "Coles Shopping Centre Development, Kingaroy", "location": "1 Pound Street, Kingaroy QLD", "builder": "Mettle / Newlands", "budget": "$30m–$50m", "budgetMin": 30, "budgetMax": 50, "distance": "224 km", "distanceKm": 224, "category": "Retail", "closes": "15 Mar 2026", "closesSort": 20260315, "region": "South Burnett", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — car park kerbing", "urgent": false, "gc": false}, {"id": 33, "name": "D&C Caboolture Social Housing 41 Units (McNab)", "location": "40-42 Lee Street, Caboolture QLD", "builder": "McNab", "budget": "$15m–$20m", "budgetMin": 15, "budgetMax": 20, "distance": "111 km", "distanceKm": 111, "category": "Government", "closes": "16 Mar 2026", "closesSort": 20260316, "region": "Moreton Bay", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils", "urgent": false, "gc": false}, {"id": 34, "name": "West Mackay Social Housing 20 Units D&C", "location": "21 Streeter Avenue, West Mackay QLD", "builder": "Woollam", "budget": "$5m–$10m", "budgetMin": 5, "budgetMax": 10, "distance": "875 km", "distanceKm": 875, "category": "Government", "closes": "16 Mar 2026", "closesSort": 20260316, "region": "Mackay", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils", "urgent": false, "gc": false}, {"id": 35, "name": "Breakfast Creek Hotel Stage 2", "location": "2 Kingsford Smith Drive, Albion QLD", "builder": "Ashley Cooper / Rohrig / Herron Coorey", "budget": "$10m–$15m", "budgetMin": 10, "budgetMax": 15, "distance": "72 km", "distanceKm": 72, "category": "Hospitality", "closes": "18 Mar 2026", "closesSort": 20260318, "region": "Brisbane", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — external works", "urgent": false, "gc": false}, {"id": 36, "name": "D&C Caboolture Social Housing 41 Units (Bryant)", "location": "40-42 Lee Street, Caboolture QLD", "builder": "Bryant", "budget": "$20m–$30m", "budgetMin": 20, "budgetMax": 30, "distance": "111 km", "distanceKm": 111, "category": "Government", "closes": "19 Mar 2026", "closesSort": 20260319, "region": "Moreton Bay", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils", "urgent": false, "gc": false}, {"id": 37, "name": "Coles Kingaroy", "location": "1 Pound Street, Kingaroy QLD", "builder": "Mainbrace / Hutch Toowoomba", "budget": "$20m–$30m", "budgetMin": 20, "budgetMax": 30, "distance": "224 km", "distanceKm": 224, "category": "Retail", "closes": "22 Mar 2026", "closesSort": 20260322, "region": "South Burnett", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — car park kerbing", "urgent": false, "gc": false}, {"id": 38, "name": "D&C DHPW Darling St, Woodend — 45x Apartments", "location": "Darling Street East, Woodend QLD", "builder": "Paynters / Bryant", "budget": "$20m–$30m", "budgetMin": 20, "budgetMax": 30, "distance": "78 km", "distanceKm": 78, "category": "Government", "closes": "22 Mar 2026", "closesSort": 20260322, "region": "Brisbane", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils", "urgent": false, "gc": false}, {"id": 39, "name": "Bay Terrace Wynnum Childcare Centre", "location": "238 Bay Terrace, Wynnum QLD", "builder": "Chapcon", "budget": "$5m–$10m", "budgetMin": 5, "budgetMax": 10, "distance": "66 km", "distanceKm": 66, "category": "Commercial", "closes": "23 Mar 2026", "closesSort": 20260323, "region": "Brisbane", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — external works", "urgent": false, "gc": false}, {"id": 40, "name": "YWCA Social Housing Toowoomba (Bryant/Hutch)", "location": "112 Mary Street, East Toowoomba QLD", "builder": "Bryant / Hutch Toowoomba", "budget": "$5m–$10m", "budgetMin": 5, "budgetMax": 10, "distance": "151 km", "distanceKm": 151, "category": "Government", "closes": "24 Mar 2026", "closesSort": 20260324, "region": "Toowoomba", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils", "urgent": false, "gc": false}, {"id": 41, "name": "Tingalpa Hotel — Stage 3", "location": "1567 Wynnum Road, Tingalpa QLD", "builder": "Fardoulys", "budget": "$15m–$20m", "budgetMin": 15, "budgetMax": 20, "distance": "65 km", "distanceKm": 65, "category": "Hospitality", "closes": "25 Mar 2026", "closesSort": 20260325, "region": "Brisbane", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — external works", "urgent": false, "gc": false}, {"id": 42, "name": "YWCA Social Housing Toowoomba (Newlands)", "location": "112 Mary Street, East Toowoomba QLD", "builder": "Newlands", "budget": "$10m–$15m", "budgetMin": 10, "budgetMax": 15, "distance": "151 km", "distanceKm": 151, "category": "Government", "closes": "26 Mar 2026", "closesSort": 20260326, "region": "Toowoomba", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils", "urgent": false, "gc": false}, {"id": 43, "name": "T3534 TMR Goorganga Overtaking Lanes", "location": "Bruce Highway, Proserpine QLD", "builder": "Bellwether", "budget": "$5m–$10m", "budgetMin": 5, "budgetMax": 10, "distance": "975 km", "distanceKm": 975, "category": "Civil", "closes": "12 Mar 2026", "closesSort": 20260312, "region": "Whitsundays", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Direct — highway civil works", "urgent": false, "gc": false}, {"id": 44, "name": "CN-25257 Bruce Highway Safety Package (Ingham–Innisfail)", "location": "Ingham QLD", "builder": "BildGroup / Georgiou / RMS Civil / McIlwain", "budget": "$100m–$200m", "budgetMin": 100, "budgetMax": 200, "distance": "1276 km", "distanceKm": 1276, "category": "Civil", "closes": "22 Feb 2026", "closesSort": 20260222, "region": "Far North QLD", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Direct — highway civil works", "urgent": false, "gc": false}, {"id": 45, "name": "Caboolture Hospital Paediatric SOPD", "location": "129 McKean Street, Caboolture QLD", "builder": "Alder / Total Construction / Hutchinson / Apollo", "budget": "$30m–$50m", "budgetMin": 30, "budgetMax": 50, "distance": "112 km", "distanceKm": 112, "category": "Health", "closes": "Ongoing", "closesSort": 20260899, "region": "Moreton Bay", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — external works", "urgent": false, "gc": false}, {"id": 46, "name": "Kedron SS Treehouse Rectification Works", "location": "Leckie Road, Kedron QLD", "builder": "Stevenson", "budget": "$500k–$750k", "budgetMin": 0.5, "budgetMax": 0.75, "distance": "76 km", "distanceKm": 76, "category": "Education", "closes": "9 Mar 2026", "closesSort": 20260309, "region": "Brisbane", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — external works", "urgent": false, "gc": false}, {"id": 47, "name": "Goodstart Hawthorne — External Works", "location": "159 Hawthorne Road, Hawthorne QLD", "builder": "Quadric", "budget": "$1m–$1.5m", "budgetMin": 1, "budgetMax": 1.5, "distance": "69 km", "distanceKm": 69, "category": "Education", "closes": "9 Mar 2026", "closesSort": 20260309, "region": "Brisbane", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — external works", "urgent": false, "gc": false}, {"id": 48, "name": "19 Apartments at Zillmere — D&C", "location": "4 Holberton Street, Zillmere QLD", "builder": "Bryant", "budget": "$10m–$15m", "budgetMin": 10, "budgetMax": 15, "distance": "81 km", "distanceKm": 81, "category": "Government", "closes": "9 Mar 2026", "closesSort": 20260309, "region": "Brisbane", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — site civils", "urgent": false, "gc": false}, {"id": 49, "name": "Woolworths Mount Pleasant Renewal", "location": "54A Phillip Street, Mount Pleasant QLD", "builder": "Streetbuild / Inten", "budget": "$2m–$3m", "budgetMin": 2, "budgetMax": 3, "distance": "878 km", "distanceKm": 878, "category": "Retail", "closes": "9 Mar 2026", "closesSort": 20260309, "region": "Mackay", "tenderSite": "EstimateOne", "tenderType": "Subcontract", "kerbRelevance": "Indirect — car park kerbing", "urgent": false, "gc": false}, {"id": 50, "name": "5893 Springfield Parkway Duplication Stage 2", "location": "Springfield Parkway, Springfield QLD", "builder": "Ipswich City Council", "budget": "Undisclosed", "budgetMin": 0, "budgetMax": 0, "distance": "55 km", "distanceKm": 55, "category": "Civil", "closes": "17 Mar 2026", "closesSort": 20260317, "region": "Ipswich", "tenderSite": "VendorPanel", "tenderType": "Public Tender", "kerbRelevance": "Direct — road duplication, kerb & channel throughout", "urgent": false, "gc": false, "vpRef": "VP499396", "buyersRef": "250902-000054", "queryDeadline": "12 Mar 2026", "notes": "29 documents attached · No briefing required · Expected decision 28 Apr 2026 · Submit via VendorPanel"}, {"id": 51, "name": "Panel of Providers — Minor Civil Works & Tree Services", "location": "Byron Shire Council area, NSW", "builder": "Byron Shire Council", "budget": "$2m/yr estimated", "budgetMin": 2, "budgetMax": 2, "distance": "175 km", "distanceKm": 175, "category": "Civil", "closes": "18 Mar 2026", "closesSort": 20260318, "region": "Northern NSW", "tenderSite": "VendorPanel", "tenderType": "Panel / Standing Offer", "kerbRelevance": "Direct — Minor Civil Works category includes kerb & channel, road rehabilitation, drainage", "urgent": false, "gc": false, "contract": "2026-0003", "term": "3 years + 2 x 1-year options", "notes": "Price Minor Civil only (not Tree Services) · Rates fixed 12 months min · ISO 9001 questionnaire required · ISO 45001 WHS required · 2 recent relevant contracts needed · NSW Reconstruction Authority Treatment Guide 2025-26 compliance · Ethical constraints: no Adani/Bravus, no offshore detention benefit"}, {"id": 52, "name": "St Mary's Carpark Kerb & Channel — Stage 2 (Corowa)", "location": "Alice Street to Mary Street, Corowa NSW", "builder": "Federation Council (Corowa)", "budget": "Undisclosed (small works)", "budgetMin": 0, "budgetMax": 0, "distance": "830 km", "distanceKm": 830, "category": "Civil", "closes": "Late Mar 2026", "closesSort": 20260325, "region": "Regional NSW", "tenderSite": "Direct / Council", "tenderType": "Quotation", "kerbRelevance": "Direct — 170 LM B2 kerb machine-lay, stormwater pit surrounds, vehicle crossings, pram crossings", "urgent": false, "gc": false, "notes": "Base already prepared by Council — contractor provides labour, plant, concrete only · N25 kerb mix · N32 crossings · 10-day contract · Start late Mar/early Apr 2026 · Traffic management plan required 14 days prior · Subcontractors need Council approval · Contact: Andrew (referred via Scale Up)"}];

const LOGO_WHITE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAGPCAYAAACAta7WAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAMJElEQVR4nO3d25LbNgJAQc3W/v8vKw9b2Ti27jokAbD7KRXbIwKkqCNQ4vxcr9cLAACd/xy9AQAAqxFYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEBNYAAAxgQUAEPvv0RsAX7oGP+Mn+BkA8H9WsPjW9dJEzqeP/S1xBUDOChbfOCqsqseeKa7ujXfrMdx63CPnbbTt+dUWz4dPx7bnc7Oe/7328V5zVG17ub2jPGeWZgWLTx0ZV4WZTjCP5vqI/TDavh9he0bYhhXcm8d6pXzP/fXtYx15lYAvCCxmdKaTzStjPdN8jMj8N8zjn8zJxAQWn3BpECi9+rw+U3CcaaxLEli8S1zt553xOhkfw7zPafTzgONqAT7kzjvEFbzm6GPtncc/+osDj77AcevPrpdm+179GUd9weSeo48tXmQFi1eJq309OqnfG4t3vaxmtuft1szHRAQWrxBXwBY+XR0645sJ57HJCCyeEVf7e+VFxyoWZ+FYZ0o+g8Uj4mp/77yjv/cZFfbz6HNC3/7c1Y322abRudHoZKxgcY+4mpfomp+bS/6bVSymI7BY0axx9ck7ei88zMjqFcsTWNwy++oV7GnLKFjx+fDpmLyZYCoCi9/NHlezvgP+5h29F57j/Vwe30KD58wdS/Ehd34lrsYjkubzzXG4+v7e6heXVzcfHdnq41uOFSz+Jq6Os+Xcr/6CDTAkgcXlIq6A7W19nln9zcTq41uOwEJcHWuP+d/iMUY72Y+2PZ9YYQxHW30OVx/fUnwG69zEFc88upnpETfTHG17isc9A3PUce6chMA6L3F1vK3uBXTvzuIrzNmWPpkj4fAdx/ptfkvDAlwiPKfZn7iznzwvl233QX3bhtHme7Tt2dIKY3VT0c+Yn8kJLPbmd7Q9Nur4Rtuu0baH27Z+M7f6PeAc5xMTWOcz+6XBlZUn0y1OzKPdSLPenk8/E7aF0ea6tvLYaqsfC8v6uV695p3IEZelysd2kgFgClawzmP2lStxBcA0BNY5iCsA2JHAWp+4AoCdCay1iSsAOIDAWpe4AoCDCKw1iSsAOJDAWs/s990QVwBMT2Dxu28CZ/a4A4CEX/a8FpcG57HnL3oufu47j1Uotnev58Nsc/u7Pbe/fKxnc7TlMbTluWqPfX+mc+1hrGCtY/bA8YT/3l4vytcdH2sGs8/FjPvzle2dcUyzbTMPCKw1iCseHQN7rhqc1QrzMssY3tnOGcYkrBYlsOYnrthz5Yr7zM+Y7BcOIbDmtmJceTfXqvavfXIOq+7nUcc16nYREFjzWjWubv039+11aZDXOG6By+XiW4SzWj2ufv9/QuG2UeJqtv0z0zcUf2dF8rGfy/2xXS9jHat7fAuSA1nBms9Z4uqdPz+jPeNqlJCjc9b9Nsu55Kz7ZykC63xmi6t3/x7swQvguJ7tG+cSdiGw5nL2E8PZx/83K0p8a/Xn0syR5Tm8CIE1jzNeGrxl5BPj1p59w9KJmW+tdAytNBYm5EPucxBXf/7bVU+en87LUfOxVfCOvn+PCv0zv8GozXgeqfb/bOOekhWs8Ymr27zQ/MPJksKKx9HMlwqZnBWssa0YV6UZ34FyPC+q5/Lo1g2Xi/MIG7GCNa6V4+rnyZ+/w53fjX8kM79Qr3wczbxfmJTAGtORcbXnY/slxJ2zjx++4flDziXC8Zwlrn79+9XJbYWl/m8+M3LE+Gef79Iec7H1ndxXeA7ds8Klwne3TzgeyArWWFa+LLjFv7tl9RPKs8urq49/ROUl773Mtr0VH3pnNwJrLd+cNI8+sYisztnHv6ezhsrMRt9nnr+LcIlwHEc+qUZZOXO58HXlXI30WHv45Lg44yW1s7JPSVjBGsPsn7sqWcl63QiXClef41fMOAczbnNp9EuFRz8+AStYxxNXf7KS9bpHc7XX2Lc4jkbbZ6Os4o2wDat45UPvKz8+G7OCdSxxdV99r6yzOvPYayOsGNIaLeRZiMA6jrh6jRuSPrfH5Q4vRP+zemTZz/sy3wsTWMcQV+/xuaznZroH08pWPb5W5rhmEwJrf+LqMyLruT1WV7wYjf8B6U+ded++M/Z6nva+j9qZ9/OuBNa+XKr5jsgaw4w31qytNP7Z9ue9bf12DK/8+y3naY/9MNN+nt7P9ep1Zierr1zt+cQtx+OEA0DOCtY8hMA/zAUAQ7OCBQAQs4IFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABATWAAAMYEFABD7C+YIYQVXzTR8AAAAAElFTkSuQmCC";

const RECIPIENT = "tender@askerbing.com.au";

// ── STATIC DATA ────────────────────────────────────────────────────────────────
const COUNCILS_DATA = [
  { id:"GC", name:"Gold Coast City Council", url:"vendorpanel.com.au/goldcoastcity/tenders", href:"https://www.vendorpanel.com.au/goldcoastcity/tenders", note:"Full VendorPanel · Existing relationship · Panel supplier · All tenders, EOIs and RFQs published here", status:"Established", statusColor:"#2E7D5F", priority:"Primary target", priorityColor:"#C9A96E" },
  { id:"LC", name:"Logan City Council", url:"vendorpanel.com.au/logancity/tenders", href:"https://www.vendorpanel.com.au/logancity/tenders", note:"Fully on VendorPanel · Must be registered on VP Marketplace to receive invites · All RFTs, EOIs and RFQs here", status:"New Target", statusColor:"#C97530", priority:"High priority", priorityColor:"#E05C4A" },
  { id:"IC", name:"Ipswich City Council", url:"ipswich.qld.gov.au · VendorPanel", href:"https://www.ipswich.qld.gov.au/Business/Doing-Business-with-Council", note:"VendorPanel for all procurement · RFQs up to $50K · 3 quotes via VP up to $500K · Formal tender above $500K", status:"New Target", statusColor:"#C97530", priority:"High priority", priorityColor:"#E05C4A" },
  { id:"RC", name:"Redland City Council", url:"vendorpanel.com.au — Redland", href:"https://www.vendorpanel.com.au/PublicTenders.aspx?mode=all&emcc=1B8EA6C1B2AD", note:"Primary e-sourcing system is VendorPanel · All public tenders listed · Register on VP Marketplace", status:"New Target", statusColor:"#C97530", priority:"Medium priority", priorityColor:"#C97530" },
  { id:"SC", name:"Sunshine Coast Council", url:"sunshinecoast.qld.gov.au/tenders", href:"https://www.sunshinecoast.qld.gov.au/council/tenders/current-tenders", note:"Moved ALL public tenders to VendorPanel effective 21 Sept 2024 · Active tenders regularly closing", status:"New Target", statusColor:"#C97530", priority:"Medium priority", priorityColor:"#C97530" },
  { id:"SR", name:"Scenic Rim Regional Council", url:"vendorpanel.com.au/scenicrim/tenders", href:"https://www.vendorpanel.com.au/scenicrim/tenders", note:"VendorPanel Marketplace for RFQs <$200K · Good for early relationship building · Smaller volume council", status:"New Target", statusColor:"#C97530", priority:"Lower priority", priorityColor:"#6B6560" },
];

const VP_CATEGORIES = [
  { name:"Kerb & Channel", note:"Machine-lay and hand-formed · All profiles" },
  { name:"Concrete Works", note:"Footpaths, slabs, shared paths, placements" },
  { name:"Minor Civil Works", note:"Streetscapes, medians, traffic islands, pram ramps" },
  { name:"Maintenance / Repairs", note:"Reactive & planned concrete/kerb maintenance panels" },
  { name:"Streetscape & Landscaping", note:"Parks upgrades, urban design, open space civil" },
  { name:"Retaining Walls & Structures", note:"Small concrete structures, parks, road corridors" },
];

const CAPABILITIES = {
  strong: [
    { name:"Extruded Concrete Kerbing", note:"30+ years · 20 machines & templates · Full SEQ coverage" },
    { name:"Concrete Footpaths & Slabs", note:"10,000+ projects delivered · Residential, commercial, municipal" },
    { name:"Kerb & Gutter / Drainage", note:"Including vac truck operations · Drainage integration" },
    { name:"Municipal Road Kerbing", note:"Gold Coast City Council established relationship" },
    { name:"Residential Development Works", note:"Hutchinson Builders, Morris Property Group track record" },
    { name:"Kerb Repair & Maintenance", note:"Full restoration services · Rapid response capability" },
    { name:"Project Management", note:"Michael Gray (GM) · Jack Rice (Supervisor) · Inception to completion" },
    { name:"Equipment & Plant Fleet", note:"20 kerb machines · 3 trucks · 2 utes · Vac truck · Diggers · 2 tippers" },
    { name:"QBCC Licence", note:"Lic. 15299341 · Renewal 23/06/2026 — calendar now" },
  ],
  moderate: [
    { name:"Landscaping Integration", note:"Offered but not primary service · Opportunity to strengthen messaging" },
    { name:"Large Retaining Walls", note:"Can deliver · Structural engineering partnership may be needed for large scope" },
    { name:"Slipform Kerbing", note:"Competitors (Forte, East Coast) lead with this heavily. Confirm capability and promote if available." },
  ],
  gaps: [
    { name:"Heritage / Decorative Finishes", note:"Required for BCC heritage streetscapes · Train 1–2 finishers in decorative concrete & exposed aggregate" },
    { name:"ISO 9001 Certification", note:"Required by large council RFTs (especially BCC) · Single biggest unlock for higher-value tenders" },
    { name:"Sunshine Coast Local Presence", note:"SCC tenders score local contractors · Identify SCC sub-contract partner" },
  ],
};

const CAP_MATRIX = [
  { cap:"Extruded Kerbing",    gc:"✓ Required", lc:"✓ Required", ip:"✓ Required", re:"✓ Required", sc:"✓ Required", sr:"✓ Required", bc:"✓ Required", gcC:"#2E7D5F", lcC:"#2E7D5F", ipC:"#2E7D5F", reC:"#2E7D5F", scC:"#2E7D5F", srC:"#2E7D5F", bcC:"#2E7D5F" },
  { cap:"Footpaths & Slabs",   gc:"✓ Required", lc:"✓ Required", ip:"✓ Required", re:"✓ Required", sc:"✓ Required", sr:"✓ Required", bc:"✓ Required", gcC:"#2E7D5F", lcC:"#2E7D5F", ipC:"#2E7D5F", reC:"#2E7D5F", scC:"#2E7D5F", srC:"#2E7D5F", bcC:"#2E7D5F" },
  { cap:"QBCC Licence",        gc:"✓ Compliant", lc:"✓", ip:"✓", re:"✓", sc:"✓", sr:"✓", bc:"✓", gcC:"#2E7D5F", lcC:"#2E7D5F", ipC:"#2E7D5F", reC:"#2E7D5F", scC:"#2E7D5F", srC:"#2E7D5F", bcC:"#2E7D5F" },
  { cap:"Slipform Capability",  gc:"~ Preferred", lc:"~ Preferred", ip:"~ Preferred", re:"— N/A", sc:"~ Preferred", sr:"— N/A", bc:"~ For large", gcC:"#C97530", lcC:"#C97530", ipC:"#C97530", reC:"#6B6560", scC:"#C97530", srC:"#6B6560", bcC:"#C97530" },
  { cap:"ISO 9001",             gc:"~ Preferred", lc:"~ Preferred", ip:"~ Preferred", re:"~ Preferred", sc:"~ Preferred", sr:"— Minor", bc:"✗ Required", gcC:"#C97530", lcC:"#C97530", ipC:"#C97530", reC:"#C97530", scC:"#C97530", srC:"#6B6560", bcC:"#E05C4A" },
  { cap:"Heritage Finishes",    gc:"— N/A", lc:"— N/A", ip:"— N/A", re:"— N/A", sc:"~ Minor", sr:"— N/A", bc:"✗ Some tenders", gcC:"#6B6560", lcC:"#6B6560", ipC:"#6B6560", reC:"#6B6560", scC:"#C97530", srC:"#6B6560", bcC:"#E05C4A" },
];

const MAJOR_COMPETITORS = [
  { name:"Forte Kerb & Channel", sub:"Major civil — Subdivisions & roads", services:"Slipform (Arrow 750XL), extruded, hand-formed, transitions, pram ramps", regions:"Sunshine Coast, Moreton Bay, Gold Coast, Somerset, Wide Bay Burnett", threat:"HIGH", advantage:"Advanced slipform machinery · Multiple crews · Strong project gallery for civil programs", counter:"30yr experience · GCCC relationship · Lean pricing · Faster small-works mobilisation" },
  { name:"East Coast Kerbing", sub:"30+ years · National reach", services:"Slipform kerb & channel, barrier walls, extruded kerb, footpaths", regions:"Gold Coast, Brisbane, Australia-wide", threat:"HIGH", advantage:"Barrier wall slipforming · National capability · 30+ years · Best operators in QLD positioning", counter:"Local SEQ focus · Municipal track record · Competitive rates · Agile crew deployment" },
  { name:"Queensland Kerb & Channel", sub:"Est. 1990 · 35+ years", services:"Extruded kerb all profiles · Subdivisions, car parks, main roads, all councils", regions:"Australia-wide · All QLD shires", threat:"HIGH", advantage:"35yr reputation · No job too big or small · National travel · Council-friendly positioning", counter:"GCCC reference · 10,000+ projects · 20 machines vs their mobile setup · SEQ specialist" },
  { name:"Superior Kerb & Concreting", sub:"Claims QLD's largest provider", services:"Civil kerbing, concreting, car parks, industrial projects", regions:"QLD-wide", threat:"HIGH", advantage:"No hidden costs transparent pricing · QLD's largest brand claim · Strong comms & reliability narrative", counter:"Adopt transparent pricing language · 30yr experience vs their scale claim · Council references" },
];

const LOCAL_COMPETITORS = [
  { name:"Kerbing Forever", sub:"Gold Coast residential", services:"Garden edging, decorative kerb, driveway kerbing, custom colours", regions:"Gold Coast", threat:"MED", advantage:"Decorative/custom kerbing · Customer-focused · Fast turnaround", counter:"Not competing in same space · Decorative kerb is an ASK gap/opportunity" },
  { name:"Blendz Concreting", sub:"Hipages · 5★ · 57 ratings", services:"Domestic & commercial concrete kerbs, garden/driveway edges", regions:"Gold Coast", threat:"MED", advantage:"High volume verified reviews · 5-star social proof · Professional reputation", counter:"ASK has no comparable review presence — build Google/VP reviews urgently" },
  { name:"Frankie's Kerbing", sub:"Hipages · 5★ · 60+ jobs", services:"Driveway edges, garden kerbs, commercial kerbs", regions:"Gold Coast", threat:"MED", advantage:"Strong review volume · Communication & reliability ratings · High hire rate", counter:"Mirror this with council reference letters + Google reviews" },
  { name:"East Coast Edging", sub:"Localsearch", services:"Edging, kerb profiles, small commercial & residential", regions:"Gold Coast", threat:"LOW", advantage:"High customer satisfaction on Localsearch · Good directory visibility", counter:"Different tier — not competing for same council work" },
];

const COMP_GAPS = [
  { title:"Slipform Capability", detail:"Forte, East Coast and QLD Kerb & Channel all lead with slipform machine specs and barrier wall capability. ASK doesn't promote this — confirm and market if you have it.", level:"HIGH" },
  { title:"Visual Case Studies", detail:"Forte and East Coast have photo-rich project galleries with large subdivision and highway-scale works. ASK's capability statement shows images but no detailed outcome-based case studies.", level:"HIGH" },
  { title:"Pricing Transparency", detail:"Superior Kerb & Concreting wins council work on no hidden costs, all-inclusive pricing messaging. ASK doesn't currently use this language — councils love pricing certainty.", level:"HIGH" },
  { title:"Social Proof / Reviews", detail:"Blendz (57 reviews) and Frankie's (60+ jobs) have strong verified review profiles. ASK has no comparable review presence on Google, Hipages, or VendorPanel performance history.", level:"MED" },
  { title:"Service Culture Messaging", detail:"Superior Kerb & Kerbing Forever make customer service their #1 value prop — 24hr response, comms plans, proactive updates. ASK lists it as a bullet point, not a commitment.", level:"MED" },
  { title:"Geographic Reach Messaging", detail:"East Coast Kerbing and QLD Kerb & Channel both market national/Australia-wide reach. ASK is SEQ only — even if that's the strategy, the messaging could be stronger.", level:"MED" },
];

const MKT_GAPS = [
  { n:1, priority:"HIGH", title:"Slipform Capability Not Marketed", body:"Forte Kerb, East Coast Kerbing and QLD Kerb & Channel all prominently feature slipform machine specs and barrier wall capability. This signals large civil readiness to councils. ASK's current statement doesn't reference slipform at all — even if you have the capability, it's invisible.", action:"Confirm whether ASK has any slipform machines. If yes — add machine specs, production rates, and slipform project photos to the capability statement immediately. If no — identify whether a sub-contractor or plant hire arrangement could fill this gap for large civil packages.", competitor:"Forte, East Coast Kerbing", effort:"Low", impact:"High", timeframe:"Week 1–2" },
  { n:2, priority:"HIGH", title:"No Detailed Case Studies or Project Gallery", body:"Competing civil firms use photo-rich, outcome-based case studies. ASK's statement has work photos but no structured case studies. Council tender evaluators look for evidence, not just assertions. '10,000+ projects' is powerful but unsubstantiated without case studies.", action:"Create 3–5 one-page case studies. Minimum: Gold Coast City Council project, one Hutchinson/Morris builder project, one maintenance project. Include: scope, challenge, solution, linear metres/day, defect rate, safety record, client quote.", competitor:"Forte, East Coast Kerbing", effort:"Medium", impact:"High", timeframe:"Month 1–2" },
  { n:3, priority:"HIGH", title:"Pricing Transparency Language Missing", body:"Superior Kerb & Concreting positions 'no hidden costs, all-inclusive pricing' as their primary differentiator and wins council work on it. Councils and project managers hate budget surprises — a competitor who commits to transparent pricing upfront wins shortlisting before the evaluation even starts.", action:"Add explicit pricing commitment to all proposals: 'Fixed-scope, transparent pricing — no hidden extras. What we quote is what you pay.' Back it with a pricing methodology section in tenders.", competitor:"Superior Kerb & Concreting", effort:"Very Low", impact:"High", timeframe:"Week 1" },
  { n:4, priority:"MED", title:"No Social Proof / Review Presence", body:"Residential competitors like Blendz (57 reviews, 5★) and Frankie's Kerbing (60+ jobs) have strong verified public profiles. VendorPanel now shows supplier performance data and council procurement officers Google suppliers. ASK has zero visible reviews or testimonials on any public platform.", action:"Request a written reference letter from Gold Coast City Council. Ask Hutchinson Builders and Morris Property Group for testimonials. Set up and build a Google Business Profile. Target 10 reviews within 60 days.", competitor:"Blendz, Frankie's Kerbing", effort:"Medium", impact:"Medium", timeframe:"Month 1–3" },
  { n:5, priority:"MED", title:"Customer Service Commitments Are Vague", body:"ASK lists 'customer-centric approach' as a bullet point. Superior Kerb & Concreting turns this into structured service commitments: response times, communication cadence, updates, complaint handling — specific enough to evaluate and score in a tender. Vague claims score poorly against specific ones.", action:"Define and publish a Customer Service Charter: 24-hour response to all council queries, weekly site reports, proactive issue notification, defect liability response within 48 hours. Name Michael Gray and Jack Rice as accountable contacts.", competitor:"Superior Kerb & Concreting", effort:"Low", impact:"Medium", timeframe:"Week 2–3" },
  { n:6, priority:"MED", title:"Geographic Messaging Too Narrow", body:"QLD Kerb & Channel and East Coast Kerbing market 'Australia-wide, any council, any size.' ASK is positioned as 'South East Queensland' only. Even if SEQ is the real strategy, this framing can eliminate ASK from tenders that have multi-region scope.", action:"Reframe as 'SEQ-wide, multi-council delivery capacity — with 20 kerbing machines, parallel crews, and full plant ready to mobilise across all SEQ councils simultaneously.' Emphasise capacity over geography.", competitor:"QLD K&C, East Coast", effort:"Very Low", impact:"Medium", timeframe:"Week 1" },
];

const TIMELINE = [
  { phase:"Week 1–2", date:"Mar 2026", priority:"HIGH", pColor:"#E05C4A", title:"Immediate Actions — Tenders & Profile", desc:"Act on closing tenders and update council profiles before more opportunities close.", steps:["Check TMR Burleigh Connection Rd tenders on EstimateOne — closing TODAY and tomorrow · 11km away · Highest direct civil fit","Review BCC Displacement Mitigation RFP (Doc93625607) — closes 23 Mar 2026 12:00 noon · Register SAP Ariba first · Call Haydn Stavros","Review Sunshine Coast tenders ITT2532, ITT2523, ITT2526 on VendorPanel — assess scope fit for concrete/civil works","Register for SAP Ariba supplier portal (Brisbane City Council) if not already done","Update VendorPanel category subscriptions: Kerb & Channel · Concrete Works · Minor Civil · Maintenance · Streetscape · Retaining Walls","Add slipform capability to VendorPanel profile and capability statement (if applicable)","Rewrite geographic positioning: replace 'South East QLD' with 'SEQ-wide, multi-council, parallel crew delivery capacity'","Add transparent pricing language to all tender documents: 'Fixed-scope, no hidden extras'"] },
  { phase:"Weeks 3–4", date:"Mar 2026", priority:"HIGH", pColor:"#E05C4A", title:"Tender Submissions & Profile Building", desc:"Submit to live tenders, build the submissions toolkit, and establish presence on new council portals.", steps:["Submit to BCC — Concrete Footpath Displacement Mitigation via SAP Ariba (closes 23 Mar 2026)","Register vendor profiles on Logan, Ipswich, Redland, Sunshine Coast and Scenic Rim VendorPanel pages","Subscribe to all 6 VendorPanel councils for all 6 categories","Request written reference letter from Gold Coast City Council — for use in all tender submissions","Contact Hutchinson Builders and Morris Property Group — request to be listed as preferred kerbing subcontractor on EstimateOne","Set up Google Business Profile for AllState Kerbing — request first 5 reviews from existing clients","Write Customer Service Charter: 24-hr response · Weekly site reports · 48-hr defect response · Named contacts (Michael Gray / Jack Rice)"] },
  { phase:"Month 2", date:"Apr 2026", priority:"HIGH", pColor:"#C97530", title:"Case Studies, New Council Submissions & ISO Planning", desc:"Build the evidence base that wins tenders and begin the quality certification process.", steps:["Build 3 detailed case studies: (1) GCCC kerbing project (2) Hutchinson/Morris builder project (3) Maintenance/repair project — problem → solution → result format with metrics","Create photo-rich project gallery — minimum 20 high-quality images from completed council and commercial works","Submit to any open Logan City Council tenders/RFQs on VendorPanel — first submission in new market","Submit to any open Ipswich City Council RFQs ($50K–$500K range) — good for building panel presence","Engage a QMS consultant to begin ISO 9001 gap analysis — get a scoping quote and timeline (typically 4–6 months)","Build reusable tender submission pack: Corporate profile · Key personnel CVs · QBCC licence · Insurance schedule · Safety policy · Case studies","Build rolling tender calendar — track close dates, Q&A windows, site visits for all 7 councils"] },
  { phase:"Month 3", date:"May 2026", priority:"HIGH", pColor:"#C97530", title:"Panel Applications & ISO Implementation Begins", desc:"Apply for standing offer panels — these generate recurring work and build council references.", steps:["Submit to at least 2x Maintenance/Minor Civil Panels (target: Gold Coast and Logan as priority)","Submit to at least 1x Kerb & Footpath Standing Offer Panel — use completed submissions toolkit","Register on Sunshine Coast Council VendorPanel pre-qualification for infrastructure programs","Identify a Sunshine Coast-based sub-contractor partner to address local presence scoring criteria in SCC tenders","Begin ISO 9001 implementation with QMS consultant — document QMS processes, ITPs, hold points, SWMS library","Target 10 Google reviews by end of Month 3 — systematically request from past council and commercial clients","Review Q1 tender wins/losses — update pricing libraries and production rates based on feedback"] },
  { phase:"Q3 2026", date:"Jun–Aug 2026", priority:"MED", pColor:"#C97530", title:"Expand to Sunshine Coast & Brisbane · ISO Progress", desc:"Begin active tendering in new councils while ISO certification approaches completion.", steps:["Bid for Brisbane City Council — Suburban Footpath Upgrade program (open via SAP Ariba) · Use case studies and GCCC reference as primary evidence","Submit to Sunshine Coast Council — Coastal Road Infrastructure Program (~$3.1M) · Include SCC sub-contractor partner","Submit to Redland City Council maintenance panel or RFQ opportunities via VendorPanel","QBCC licence renewal due 23/06/2026 — renew minimum 4 weeks prior · Update insurance simultaneously","ISO 9001 internal audit — working towards certification by Q4 2026","Pursue decorative/heritage kerbing training for 1–2 finishers — opens BCC heritage streetscape tenders"] },
  { phase:"Q4 2026", date:"Sep–Dec 2026", priority:"GROWTH", pColor:"#2E7D5F", title:"ISO Certification · BCC Panel Application · 4-Council Presence", desc:"Achieve the quality certification that unlocks high-value tenders, and consolidate multi-council presence.", steps:["Achieve ISO 9001 certification — promote immediately in all tender submissions and VendorPanel profile","Apply for Brisbane City Council standing panel (now ISO-eligible for larger-value tenders)","Consolidate: active on Gold Coast, Logan, Ipswich, and Redland VendorPanel panels · Continue BCC and SCC pursuit","Build 2 additional near-regional council targets: Toowoomba Regional Council, Moreton Bay Regional Council — register on portals","Review and update capability statement with: new case studies · ISO certification · Testimonials · Improved slipform and heritage capability sections"] },
  { phase:"FY2027+", date:"Jan 2027 →", priority:"TARGET", pColor:"#2E7D5F", title:"Goal State — 7-Council Presence · $6–10M Annual Council Revenue", desc:"Full diversification achieved. No single council represents more than 40% of council revenue.", steps:["Active on VendorPanel panels for: Gold Coast · Logan · Ipswich · Redland · Sunshine Coast · Scenic Rim","Active on SAP Ariba panel for Brisbane City Council","ISO 9001 certified — eligible for all high-value council tenders across SEQ","Reusable submission toolkit fully built — capability statement, case studies, CVs, compliance pack, pricing methodology","Review/testimonial profile established — 20+ Google reviews, council reference letters, VendorPanel performance history","Estimated annual council revenue: $6M–$10M across 7 councils · Down from single-council dependency","Explore near-regional expansion: Toowoomba, Moreton Bay, Noosa, Fraser Coast"] },
];

const CHECKLIST_WEEK = [
  "Check Scenic Rim stormwater tender on VendorPanel",
  "Assess Sunshine Coast tenders ITT2532 / ITT2523 / ITT2526",
  "Register on SAP Ariba — Brisbane City Council supplier portal",
  "Update VendorPanel category subscriptions (all 6 categories)",
  "Add transparent pricing language to capability statement",
  "Rewrite geographic positioning to emphasise SEQ-wide capacity",
  "Confirm slipform capability and add to profile if applicable",
  "Calendar QBCC renewal: 23/06/2026",
];

const CHECKLIST_MONTH = [
  "Register vendor profiles on Logan, Ipswich, Redland, SCC, Scenic Rim portals",
  "Request reference letter from Gold Coast City Council",
  "Contact Hutchinson Builders & Morris Property for EstimateOne listing",
  "Set up Google Business Profile — get 10 reviews in 60 days",
  "Write Customer Service Charter with specific commitments",
  "Build 3 case studies (GCCC + builder + maintenance)",
  "Get ISO 9001 scoping quote from QMS consultant",
  "Submit to Logan and Ipswich first VendorPanel RFQs",
];

// ── HELPER COMPONENTS ──────────────────────────────────────────────────────────
const unique = (arr, key) => ["All", ...Array.from(new Set(arr.map(x => x[key]))).sort()];

const SL = ({ children, mt = "20px" }) => (
  <div style={{ fontFamily:"monospace", fontSize:"9px", letterSpacing:"3px", textTransform:"uppercase", color:"#6B6560", marginBottom:"12px", marginTop:mt, paddingBottom:"6px", borderBottom:"1px solid #1E1C18" }}>{children}</div>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background:"#131210", border:"1px solid #1E1C18", padding:"16px 20px", ...style }}>{children}</div>
);

const PT = ({ title, sub }) => (
  <div style={{ marginBottom:"20px" }}>
    <div style={{ fontSize:"22px", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color:"#E8E0D0", marginBottom:"4px" }}>{title}</div>
    <div style={{ fontFamily:"monospace", fontSize:"10px", color:"#6B6560", letterSpacing:"1px", marginBottom:"8px" }}>{sub}</div>
    <div style={{ height:"2px", width:"100px", background:"linear-gradient(to right, #C9A96E, transparent)" }} />
  </div>
);

const ThreatBadge = ({ t }) => {
  const c = t === "HIGH" ? "#E05C4A" : t === "MED" ? "#C97530" : "#6B6560";
  return <span style={{ padding:"2px 8px", background:`${c}22`, border:`1px solid ${c}`, color:c, fontFamily:"monospace", fontSize:"8px", letterSpacing:"1px", fontWeight:700, borderRadius:"2px" }}>{t}</span>;
};

const Badge = ({ label, color }) => (
  <span style={{ padding:"2px 8px", background:`${color}22`, border:`1px solid ${color}`, color, fontFamily:"monospace", fontSize:"8px", letterSpacing:"1px", borderRadius:"2px" }}>{label}</span>
);

function FilterSelect({ label, options, value, onChange }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
      <div style={{ fontFamily:"monospace", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#6B6560" }}>{label}</div>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ background:"#1A1812", border:"1px solid #2A2720", color:value === "All" ? "#6B6560" : "#E8E0D0", fontFamily:"monospace", fontSize:"11px", padding:"7px 10px", outline:"none", cursor:"pointer", minWidth:"130px", borderRadius:"2px" }}>
        {options.map(o => <option key={o} value={o}>{o === "All" ? `All ${label}s` : o}</option>)}
      </select>
    </div>
  );
}

function RelevanceBadge({ relevance }) {
  const isDirect = relevance.startsWith("Direct");
  return (
    <span style={{ display:"inline-block", padding:"2px 7px", fontFamily:"monospace", fontSize:"8px", letterSpacing:"1px", textTransform:"uppercase", border:`1px solid ${isDirect ? "#2E7D5F" : "#2A2720"}`, background:isDirect ? "rgba(46,125,95,0.1)" : "transparent", color:isDirect ? "#2E7D5F" : "#6B6560", borderRadius:"2px", whiteSpace:"nowrap" }}>
      {isDirect ? "✦ Direct" : "Indirect"}
    </span>
  );
}

// Today as YYYYMMDD integer for close date comparison
const TODAY_SORT = (() => {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth()+1) * 100 + d.getDate();
})();
const isClosed = (t) => t.closesSort !== 99999999 && t.closesSort < TODAY_SORT && (!t.status || t.status === "" || t.status === "Pass" || t.status === "Lost");

function TenderCard({ tender, onFollowUp, pipelineData }) {
  const [expanded, setExpanded] = useState(false);
  const urgC = tender.urgent ? "#E05C4A" : "#8A8078";
  const pd = pipelineData?.[tender.id] || {};
  const STATUS_CONFIG = {
    "Reviewing":  { color:"#C9A96E", bg:"rgba(201,169,110,0.12)" },
    "Bidding":    { color:"#C97530", bg:"rgba(201,117,48,0.12)" },
    "Submitted":  { color:"#4A90D9", bg:"rgba(74,144,217,0.12)" },
    "Won":        { color:"#2E7D5F", bg:"rgba(46,125,95,0.12)" },
    "Lost":       { color:"#E05C4A", bg:"rgba(224,92,74,0.12)" },
    "Pass":       { color:"#6B6560", bg:"rgba(107,101,96,0.12)" },
  };
  const statusCfg = STATUS_CONFIG[pd.status];
  const hasStatus = pd.status && pd.status !== "";
  const leftBorderColor = hasStatus ? (statusCfg?.color || "#2A2720") : tender.kerbRelevance.startsWith("Direct") ? "#2E7D5F" : "#2A2720";

  return (
    <div style={{ background: hasStatus ? (statusCfg?.bg || "#131210") : tender.id === 1 ? "rgba(201,169,110,0.04)" : "#131210", border:`1px solid ${hasStatus ? statusCfg?.color+"44" : tender.id === 1 ? "rgba(201,169,110,0.25)" : "#1E1C18"}`, borderLeft:`3px solid ${leftBorderColor}`, marginBottom:"3px" }}>
      <div onClick={() => setExpanded(!expanded)} style={{ display:"grid", gridTemplateColumns:"1fr 200px 120px 80px 80px 90px 90px 110px 160px", gap:"8px", alignItems:"center", padding:"10px 14px", cursor:"pointer" }}>
        <div>
          <div style={{ fontWeight:600, fontSize:"12px", color:"#E8E0D0", lineHeight:"1.3", marginBottom:"2px" }}>{tender.name}</div>
          <div style={{ fontSize:"10px", color:"#6B6560", fontFamily:"monospace" }}>{tender.region} · {tender.category}</div>
        </div>
        <div style={{ fontSize:"10px", color:"#8A8078", lineHeight:"1.4", fontStyle:"italic" }}>{(() => { const s = tender.summary || tender.kerbRelevance || ""; return s.length > 90 ? s.substring(0,88)+"…" : s; })()}</div>
        <div style={{ fontSize:"11px", color:"#8A8078", lineHeight:"1.3" }}>{tender.builder.split("/")[0].trim()}</div>
        <div style={{ fontFamily:"monospace", fontSize:"10px", color:"#8A8078" }}>{tender.budget}</div>
        <div style={{ fontFamily:"monospace", fontSize:"10px", color:"#8A8078" }}>{tender.distance}</div>
        <RelevanceBadge relevance={tender.kerbRelevance} />
        <div style={{ fontFamily:"monospace", fontSize:"10px", fontWeight:600, color:urgC }}>{tender.closes}</div>
        <div>
          {statusCfg
            ? <span style={{ display:"inline-block", padding:"3px 8px", background:statusCfg.bg, border:`1px solid ${statusCfg.color}`, color:statusCfg.color, fontFamily:"monospace", fontSize:"8px", letterSpacing:"1px", fontWeight:700, borderRadius:"2px" }}>{statusCfg.label}</span>
            : <span style={{ fontFamily:"monospace", fontSize:"8px", color:"#3A3530" }}>— no status</span>
          }
          {pd.owner && <div style={{ fontFamily:"monospace", fontSize:"8px", color:"#6B6560", marginTop:"3px" }}>{pd.owner}</div>}
        </div>
        <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
          <button onClick={e => { e.stopPropagation(); onFollowUp(tender); }} style={{ padding:"5px 8px", background:"rgba(201,169,110,0.08)", border:"1px solid rgba(201,169,110,0.4)", color:"#C9A96E", fontFamily:"monospace", fontSize:"8px", letterSpacing:"0.5px", textTransform:"uppercase", cursor:"pointer", borderRadius:"2px", lineHeight:"1.4", whiteSpace:"nowrap" }}>Interested<br/>— Follow Up</button>
          <span style={{ color:"#2A2720", fontSize:"12px", transform:expanded ? "rotate(180deg)" : "none", display:"inline-block", transition:"transform .2s" }}>▾</span>
        </div>
      </div>
      {expanded && (
        <div style={{ borderTop:"1px solid #1E1C18", background:"#0F0E0B" }}>
          <div style={{ padding:"12px 14px 14px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px" }}>
            {[["Location", tender.location],["All Builders", tender.builder],["Kerb & Channel Scope", tender.kerbRelevance],["Region", tender.region],["Tender Site", tender.tenderSite],["Tender Type", tender.tenderType]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontFamily:"monospace", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", color:"#6B6560", marginBottom:"4px" }}>{label}</div>
                <div style={{ fontSize:"12px", color:label === "Tender Site" && val === "SAP Ariba" ? "#C97530" : "#C0B8A8" }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:"1px solid #1E1C18", padding:"12px 14px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr 180px", gap:"12px", alignItems:"start" }}>
            <div>
              <div style={{ fontFamily:"monospace", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", color:"#6B6560", marginBottom:"5px" }}>Status</div>
              <div style={{ fontSize:"11px", color: statusCfg ? statusCfg.color : "#3A3530", fontWeight: statusCfg ? 600 : 400 }}>{pd.status || "— not set"}</div>
            </div>
            <div>
              <div style={{ fontFamily:"monospace", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", color:"#6B6560", marginBottom:"5px" }}>Owner</div>
              <div style={{ fontSize:"11px", color: pd.owner ? "#E8E0D0" : "#3A3530" }}>{pd.owner || "— unassigned"}</div>
            </div>
            <div>
              <div style={{ fontFamily:"monospace", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", color:"#6B6560", marginBottom:"5px" }}>Notes{pd.deadline ? ` · Due: ${pd.deadline}` : ""}</div>
              <div style={{ fontSize:"11px", color: pd.notes ? "#C9A96E" : "#3A3530", fontStyle: pd.notes ? "italic" : "normal" }}>{pd.notes || "— no notes"}</div>
            </div>
            <div>
              <div style={{ fontFamily:"monospace", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", color:"#6B6560", marginBottom:"5px" }}>Update Pipeline</div>
              <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSKLmBtPdvgmuTBTkCE8AjE3acbGJJu_gG3tkN3L_SBsYzB6sNAUCcYRdBxaxEAubGX2CnRJnWyK1wJ/pub?gid=1164355083&single=true&output=csv" target="_blank" rel="noreferrer" style={{ display:"inline-block", padding:"6px 10px", background:"rgba(201,169,110,0.08)", border:"1px solid rgba(201,169,110,0.4)", color:"#C9A96E", fontFamily:"monospace", fontSize:"8px", letterSpacing:"0.5px", textTransform:"uppercase", borderRadius:"2px", textDecoration:"none", lineHeight:"1.4" }}>
                ↗ Edit in<br/>Google Sheet
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FollowUpModal({ tender, onClose }) {
  const [urgency, setUrgency] = useState("High — We want to bid on this");
  const [notes, setNotes] = useState("");

  const buildMailto = () => {
    const subject = encodeURIComponent(`Tender Follow-Up: ${tender.name}`);
    const body = encodeURIComponent(
`TENDER FOLLOW-UP REQUEST
━━━━━━━━━━━━━━━━━━━━━━━━

Tender:     ${tender.name}
Closes:     ${tender.closes}
Budget:     ${tender.budget}
Region:     ${tender.region}
Site:       ${tender.tenderSite}
Type:       ${tender.tenderType}
K&C Scope:  ${tender.kerbRelevance}

URGENCY: ${urgency}

NOTES:
${notes || "No additional notes."}

— Sent from AllState Kerbing Strategy Dashboard`
    );
    return `mailto:tender@askerbing.com.au?subject=${subject}&body=${body}`;
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.82)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ background:"#131210", border:"1px solid #2A2720", borderTop:"3px solid #C9A96E", width:"100%", maxWidth:"500px", padding:"28px 32px", position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:"16px", right:"20px", background:"none", border:"none", color:"#6B6560", fontSize:"20px", cursor:"pointer" }}>✕</button>
        <div style={{ fontSize:"20px", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color:"#E8E0D0", marginBottom:"4px" }}>Interested — Follow Up</div>
        <div style={{ fontFamily:"monospace", fontSize:"10px", color:"#C9A96E", letterSpacing:"1px", marginBottom:"20px", paddingBottom:"16px", borderBottom:"1px solid #2A2720" }}>{tender.name}</div>
        <div style={{ marginBottom:"12px" }}>
          <div style={{ fontFamily:"monospace", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", color:"#6B6560", marginBottom:"6px" }}>Urgency Level</div>
          <select value={urgency} onChange={e => setUrgency(e.target.value)} style={{ width:"100%", background:"#1A1812", border:"1px solid #2A2720", color:"#E8E0D0", fontFamily:"monospace", fontSize:"12px", padding:"10px 12px", outline:"none", borderRadius:"2px" }}>
            <option>High — We want to bid on this</option>
            <option>Medium — Worth exploring further</option>
            <option>Low — Just flag for awareness</option>
          </select>
        </div>
        <div style={{ marginBottom:"20px" }}>
          <div style={{ fontFamily:"monospace", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", color:"#6B6560", marginBottom:"6px" }}>Notes (optional)</div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="e.g. We have capacity, know the builder, specific questions..." style={{ width:"100%", background:"#1A1812", border:"1px solid #2A2720", color:"#E8E0D0", fontFamily:"sans-serif", fontSize:"13px", padding:"10px 12px", outline:"none", resize:"none", boxSizing:"border-box", borderRadius:"2px" }} />
        </div>
        <div style={{ padding:"10px 14px", background:"#0D0C0A", border:"1px solid #1E1C18", borderLeft:"2px solid #C9A96E", fontSize:"11px", color:"#6B6560", marginBottom:"16px", lineHeight:"1.6" }}>
          Clicking <strong style={{ color:"#E8E0D0" }}>Open in Outlook</strong> will open a pre-filled draft in your email app addressed to <strong style={{ color:"#C9A96E" }}>tender@askerbing.com.au</strong> — just review and hit send.
        </div>
        <div style={{ display:"flex", gap:"10px" }}>
          <button onClick={onClose} style={{ background:"none", border:"1px solid #2A2720", color:"#6B6560", fontFamily:"monospace", fontSize:"10px", letterSpacing:"1px", textTransform:"uppercase", padding:"12px 20px", cursor:"pointer", borderRadius:"2px" }}>Cancel</button>
          <a href={buildMailto()} onClick={onClose} style={{ flex:1, background:"#C9A96E", border:"none", color:"#131210", fontFamily:"monospace", fontSize:"10px", letterSpacing:"1.5px", textTransform:"uppercase", padding:"12px", cursor:"pointer", fontWeight:700, borderRadius:"2px", textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
            ↗ Open in Outlook
          </a>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("tenders");
  const [modal, setModal] = useState(null);
  const [tenders, setTenders] = useState(TENDERS);
  const [sheetsUrl, setSheetsUrl] = useState(() => { try { return localStorage.getItem("ask_sheets_url") || ""; } catch { return ""; } });
  const [liveStatus, setLiveStatus] = useState(null);
  const [liveMsg, setLiveMsg] = useState("");
  const [lastSync, setLastSync] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const [importMsg, setImportMsg] = useState("");
  const [ejsConfig, setEjsConfig] = useState(() => { try { return JSON.parse(localStorage.getItem("ask_ejs") || "{}"); } catch { return {}; } });
  const [checklist, setChecklist] = useState(() => { try { return JSON.parse(localStorage.getItem("ask_cl") || "{}"); } catch { return {}; } });

  const [search, setSearch] = useState("");
  const [archiveSearch, setArchiveSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterRelevance, setFilterRelevance] = useState("All");
  const [filterSite, setFilterSite] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [budgetRange, setBudgetRange] = useState("All");
  const [sortBy, setSortBy] = useState("closes");

  const budgetRanges = ["All", "Under $5m", "$5m – $20m", "$20m – $50m", "$50m+", "Undisclosed"];

  const toggleCheck = (key) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    try { localStorage.setItem("ask_cl", JSON.stringify(updated)); } catch {}
  };

  const fetchFromSheets = async (url) => {
    if (!url) return;
    setLiveStatus("loading");
    setLiveMsg("Connecting...");

    const PROXIES = [
      (u) => u,
      (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
      (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      (u) => `https://thingproxy.freeboard.io/fetch/${u}`,
      (u) => `https://proxy.cors.sh/${u}`,
    ];

    let res = null;
    let lastErr = "";
    for (let i = 0; i < PROXIES.length; i++) {
      const proxyUrl = PROXIES[i](url);
      setLiveMsg(`Trying connection ${i + 1} of ${PROXIES.length}...`);
      try {
        const r = await Promise.race([
          fetch(proxyUrl, { cache: "no-store" }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 8000))
        ]);
        if (r.ok) { res = r; break; }
        lastErr = `HTTP ${r.status} on attempt ${i + 1}`;
      } catch(e) {
        lastErr = `${e.message} on attempt ${i + 1}`;
      }
    }
    try {
      if (!res) throw new Error(`All ${PROXIES.length} connection methods failed. Last: ${lastErr} — use .xlsx Import button instead.`);
      const csv = await res.text();
      const lines = csv.split("\n").filter(l => l.trim());
      if (lines.length < 2) throw new Error("Sheet appears empty");
      const parseCSV = (line) => {
        const result = []; let cur = ""; let inQ = false;
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if (ch === '"') { inQ = !inQ; } else if (ch === "," && !inQ) { result.push(cur.trim()); cur = ""; } else { cur += ch; }
        }
        result.push(cur.trim()); return result;
      };
      // Find the header row — scan up to 8 rows to handle banner/title rows before headers
      let headerRowIndex = 0;
      for (let i = 0; i < Math.min(lines.length, 8); i++) {
        const cols = parseCSV(lines[i]).map(h => h.replace(/^"|"$/g, "").trim().toLowerCase());
        if (cols.includes("id") && (cols.includes("name") || cols.includes("project name"))) {
          headerRowIndex = i; break;
        }
      }
      const headers = parseCSV(lines[headerRowIndex]).map(h => h.replace(/^"|"$/g, "").trim());
      // Only parse rows where the first column is a real numeric ID (skips hint rows, blank rows)
      const parsed = lines.slice(headerRowIndex + 1).filter(line => {
        const firstVal = parseCSV(line)[0]?.replace(/^"|"$/g, "").trim();
        return firstVal && !isNaN(Number(firstVal)) && Number(firstVal) > 0;
      }).map((line, idx) => {
        const vals = parseCSV(line); const obj = {};
        headers.forEach((h, i) => { obj[h] = (vals[i] || "").replace(/^"|"$/g, "").trim(); });
        // Support both exact column names and the formatted header names in the Excel
        const get = (...keys) => { for (const k of keys) { if (obj[k] !== undefined && obj[k] !== "") return obj[k]; } return ""; };
        return { id: Number(get("id","ID")) || idx+1, name: get("name","Project Name")||"", location: get("location","Location")||"", builder: get("builder","Builder(s)")||"", budget: get("budget","Budget Display")||"", budgetMin: parseFloat(get("budgetMin","Min ($m)"))||0, budgetMax: parseFloat(get("budgetMax","Max ($m)"))||0, distance: get("distance","Distance Display")||"", distanceKm: parseFloat(get("distanceKm","Dist (km)"))||0, category: get("category","Category")||"Other", closes: get("closes","Closes")||"", closesSort: parseInt(get("closesSort","Closes Sort"))||99999999, region: get("region","Region")||"", tenderSite: get("tenderSite","Source Site")||"", tenderType: get("tenderType","Type")||"", kerbRelevance: get("kerbRelevance","Kerb & Channel Scope")||"", urgent: String(get("urgent","Urgent")).toUpperCase()==="TRUE", gc: String(get("gc","Gold Coast")).toUpperCase()==="TRUE", status: get("status","Status")||"", owner: get("owner","Owner")||"", internalNotes: get("internalNotes","internalNotes","Internal Notes")||"", internalDeadline: get("internalDeadline","internalDeadline","Internal Deadline")||"", summary: get("summary","Summary")||"" };
      }).filter(t => t.name && t.name.length > 2);
      if (parsed.length === 0) throw new Error("No valid tender rows found");
      setTenders(parsed); setLiveStatus("live"); setLastSync(new Date().toLocaleTimeString("en-AU")); setLiveMsg(`✓ ${parsed.length} tenders live`);
    } catch(err) { setLiveStatus("error"); setLiveMsg(`✗ ${err.message}`); }
  };

  const saveSheetsUrl = (url) => {
    try { localStorage.setItem("ask_sheets_url", url); } catch {}
    setSheetsUrl(url); fetchFromSheets(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type:"binary" });
        const ws = wb.Sheets["Tenders"];
        if (!ws) throw new Error("No sheet named 'Tenders' found");
        // Scan to find which row has the real headers (handles banner rows 1-2)
        const rawRows = XLSX.utils.sheet_to_json(ws, { header:1, defval:"" });
        let hdrRowIdx = 0;
        for (let i = 0; i < Math.min(rawRows.length, 8); i++) {
          const cols = rawRows[i].map(v => String(v).toLowerCase().trim());
          if (cols.includes("id") && (cols.includes("name") || cols.includes("project name"))) {
            hdrRowIdx = i; break;
          }
        }
        const headers = rawRows[hdrRowIdx].map(v => String(v).trim());
        // Helper: find value by trying multiple possible column name aliases
        const xget = (row, ...keys) => {
          for (const k of keys) {
            const idx = headers.findIndex(h => h.toLowerCase() === k.toLowerCase());
            if (idx >= 0 && row[idx] !== undefined && row[idx] !== "") return String(row[idx]);
          }
          return "";
        };
        // Only parse rows after header+hint where ID column contains a real positive number.
        // Uses header-based lookup (xget) so formula-computed IDs (e.g. =IF(B5<>"",ROW()-4,""))
        // are handled correctly — falls back to positional row[0] for sheets without an ID header.
        const parsed = rawRows.slice(hdrRowIdx + 1)
          .filter(row => { const v = String(xget(row,"id","ID") || row[0] || "").trim(); return v && !isNaN(Number(v)) && Number(v) > 0; })
          .map((row, idx) => ({
            id: Number(xget(row,"id","ID")) || idx+1,
            name: xget(row,"name","project name"),
            location: xget(row,"location"),
            builder: xget(row,"builder","builder(s)"),
            budget: xget(row,"budget","budget display"),
            budgetMin: parseFloat(xget(row,"budgetmin","min ($m)"))||0,
            budgetMax: parseFloat(xget(row,"budgetmax","max ($m)"))||0,
            distance: xget(row,"distance","distance display"),
            distanceKm: parseFloat(xget(row,"distancekm","dist (km)"))||0,
            category: xget(row,"category")||"Other",
            closes: xget(row,"closes"),
            closesSort: parseInt(xget(row,"closessort","closes sort"))||99999999,
            region: xget(row,"region"),
            tenderSite: xget(row,"tendersite","source site"),
            tenderType: xget(row,"tendertype","type"),
            kerbRelevance: xget(row,"kerbrelevance","kerb & channel scope"),
            urgent: xget(row,"urgent").toUpperCase()==="TRUE",
            gc: xget(row,"gc","gold coast").toUpperCase()==="TRUE",
            status: xget(row,"status"),
            owner: xget(row,"owner"),
            internalNotes: xget(row,"internalnotes","internal notes"),
            internalDeadline: xget(row,"internaldeadline","internal deadline"),
            summary: xget(row,"summary"),
          })).filter(r => r.name && r.name.length > 2);
        if (parsed.length === 0) throw new Error("No valid tender rows found");
        setTenders(parsed); setImportStatus("success"); setImportMsg(`✓ ${parsed.length} tenders imported from ${file.name}`);
        setTimeout(() => setImportStatus(null), 5000);
      } catch(err) { setImportStatus("error"); setImportMsg(`✗ Import failed: ${err.message}`); }
    };
    reader.readAsBinaryString(file); e.target.value = "";
  };

  // Split tenders: open (close date not yet passed) vs archived (close date passed)
  const { openTenders, archivedTenders } = useMemo(() => {
    const open = [], archived = [];
    tenders.forEach(t => (isClosed(t) ? archived : open).push(t));
    return { openTenders: open, archivedTenders: archived };
  }, [tenders]);

  const filtered = useMemo(() => {
    let r = openTenders.filter(t => {
      if (search && ![t.name, t.builder, t.location].some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
      if (filterRegion !== "All" && t.region !== filterRegion) return false;
      if (filterCategory !== "All" && t.category !== filterCategory) return false;
      if (filterSite !== "All" && t.tenderSite !== filterSite) return false;
      if (filterType !== "All" && t.tenderType !== filterType) return false;
      if (filterRelevance === "Direct" && !t.kerbRelevance.startsWith("Direct")) return false;
      if (filterRelevance === "Indirect" && !t.kerbRelevance.startsWith("Indirect")) return false;
      if (filterUrgent && !t.urgent) return false;
      if (budgetRange === "Undisclosed" && t.budgetMin !== 0) return false;
      if (budgetRange === "Under $5m" && (t.budgetMin === 0 || t.budgetMax >= 5)) return false;
      if (budgetRange === "$5m – $20m" && (t.budgetMin < 5 || t.budgetMax > 20)) return false;
      if (budgetRange === "$20m – $50m" && (t.budgetMin < 20 || t.budgetMax > 50)) return false;
      if (budgetRange === "$50m+" && t.budgetMax < 50) return false;
      return true;
    });
    r.sort((a, b) => sortBy === "closes" ? a.closesSort - b.closesSort : sortBy === "distance" ? a.distanceKm - b.distanceKm : sortBy === "budget" ? b.budgetMax - a.budgetMax : a.name.localeCompare(b.name));
    return r;
  }, [openTenders, search, filterRegion, filterCategory, filterSite, filterType, filterRelevance, filterUrgent, budgetRange, sortBy]);

  const activeFilterCount = [search, filterRegion !== "All", filterCategory !== "All", filterSite !== "All", filterType !== "All", filterRelevance !== "All", filterUrgent, budgetRange !== "All"].filter(Boolean).length;

  const Pill = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{ padding:"4px 12px", fontFamily:"monospace", fontSize:"9px", letterSpacing:"1px", textTransform:"uppercase", border:active ? "1px solid #C9A96E" : "1px solid #2A2720", background:active ? "rgba(201,169,110,0.12)" : "#1A1812", color:active ? "#C9A96E" : "#6B6560", cursor:"pointer", borderRadius:"2px", whiteSpace:"nowrap" }}>{label}</button>
  );

  const saveEjsConfig = () => {
    const cfg = { publicKey: document.getElementById("ejs-pk")?.value?.trim(), serviceId: document.getElementById("ejs-sid")?.value?.trim(), templateId: document.getElementById("ejs-tid")?.value?.trim() };
    try { localStorage.setItem("ask_ejs", JSON.stringify(cfg)); } catch {}
    setEjsConfig(cfg); alert("Saved! Email is now active.");
  };

  const TABS = [
    { id:"tenders", label:"Tender Intelligence" },
    { id:"pipeline", label:"🔧 Active Pipeline" },
    { id:"archive", label:"📁 Archive" },
    { id:"councils", label:"Council Portals" },
    { id:"capabilities", label:"Capability Map" },
    { id:"competitors", label:"Competitors" },
    { id:"gaps", label:"Marketing Gaps" },
    { id:"timeline", label:"Action Timeline" },
    { id:"setup", label:"⚙ Setup" },
  ];

  const STATUS_CONFIG = {
    "Reviewing":  { color:"#C9A96E", bg:"rgba(201,169,110,0.12)", label:"Reviewing",  order:1 },
    "Bidding":    { color:"#C97530", bg:"rgba(201,117,48,0.12)",  label:"Bidding",    order:2 },
    "Submitted":  { color:"#4A90D9", bg:"rgba(74,144,217,0.12)", label:"Submitted",  order:3 },
    "Won":        { color:"#2E7D5F", bg:"rgba(46,125,95,0.12)",  label:"Won ✓",      order:4 },
    "Lost":       { color:"#E05C4A", bg:"rgba(224,92,74,0.12)",  label:"Lost",       order:5 },
    "Pass":       { color:"#6B6560", bg:"rgba(107,101,96,0.12)", label:"Pass",       order:6 },
  };
  const OWNERS = ["Michael Gray", "Jack Rice", "Dean Clark", "Unassigned"];

  // Pipeline data comes directly from the live sheet —
  // each tender object already has .status and .owner from the CSV columns
  // Build a lookup map for convenience (keyed by tender id)
  const pipelineData = useMemo(() => {
    const map = {};
    tenders.forEach(t => {
      if (t.status || t.owner || t.internalNotes || t.internalDeadline) {
        map[t.id] = {
          status: t.status || "",
          owner: t.owner || "",
          notes: t.internalNotes || "",
          deadline: t.internalDeadline || "",
        };
      }
    });
    return map;
  }, [tenders]);

  const activeTenders = useMemo(() =>
    openTenders.filter(t => t.status && t.status !== "Pass" && t.status !== ""),
  [openTenders]);

  // Auto-refresh when a sheets URL is connected
  const [syncInterval, setSyncInterval] = useState(() => { try { return parseInt(localStorage.getItem("ask_sync_interval")) || 5; } catch { return 5; } });
  const [nextRefresh, setNextRefresh] = useState(null);
  const sheetsUrlRef = React.useRef(sheetsUrl);
  sheetsUrlRef.current = sheetsUrl;
  React.useEffect(() => {
    if (!sheetsUrl) return;
    const INTERVAL = syncInterval * 60 * 1000;
    let nextTime = Date.now() + INTERVAL;
    setNextRefresh(Math.ceil((nextTime - Date.now()) / 1000));
    const refresh = setInterval(() => {
      if (sheetsUrlRef.current) {
        fetchFromSheets(sheetsUrlRef.current);
        nextTime = Date.now() + INTERVAL;
      }
    }, INTERVAL);
    const countdown = setInterval(() => {
      const secs = Math.ceil((nextTime - Date.now()) / 1000);
      setNextRefresh(secs > 0 ? secs : 0);
    }, 10000);
    return () => { clearInterval(refresh); clearInterval(countdown); };
  }, [sheetsUrl, syncInterval]);

  const StatusBadge = ({ status }) => {
    if (!status) return null;
    const cfg = STATUS_CONFIG[status];
    if (!cfg) return null;
    return <span style={{ padding:"2px 8px", background:cfg.bg, border:`1px solid ${cfg.color}`, color:cfg.color, fontFamily:"monospace", fontSize:"8px", letterSpacing:"1px", fontWeight:700, borderRadius:"2px", whiteSpace:"nowrap" }}>{cfg.label}</span>;
  };

  const tabPad = { padding:"28px 32px", maxWidth:"1100px" };
  const g3 = { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", background:"#1E1C18", border:"1px solid #1E1C18" };
  const g2 = { display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"12px" };

  return (
    <>
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} body{margin:0} * {box-sizing:border-box}`}</style>
    <div style={{ minHeight:"100vh", background:"#0D0C0A", color:"#E8E0D0", fontFamily:"system-ui, sans-serif" }}>

      {/* ── HEADER ── */}
      <header style={{ background:"#131210", borderBottom:"1px solid #1E1C18", padding:"0 24px", display:"flex", alignItems:"center", gap:"16px", height:"56px", position:"sticky", top:0, zIndex:100, flexWrap:"nowrap", overflowX:"auto" }}>
        <img src={LOGO_WHITE} alt="AllState Kerbing" style={{ height:"24px", width:"auto", flexShrink:0 }} />
        <div style={{ width:"1px", height:"32px", background:"#2A2720", flexShrink:0 }} />
        <div style={{ fontFamily:"monospace", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", color:"#6B6560", flexShrink:0 }}>SEQ Strategy · 2026</div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"4px", flexShrink:0 }}>
          {liveStatus === "live" && (
            <div style={{ display:"flex", alignItems:"center", gap:"5px", padding:"4px 10px", background:"rgba(46,125,95,0.08)", border:"1px solid rgba(46,125,95,0.3)", borderRadius:"2px", marginRight:"6px" }}>
              <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#2E7D5F", display:"inline-block", animation:"pulse 2s infinite" }} />
              <span style={{ fontFamily:"monospace", fontSize:"8px", color:"#2E7D5F", letterSpacing:"1px" }}>LIVE</span>
              {nextRefresh !== null && <span style={{ fontFamily:"monospace", fontSize:"7px", color:"#2E7D5F", opacity:0.7 }}>↻{Math.floor(nextRefresh/60)}m{nextRefresh%60}s</span>}
              <button onClick={() => { fetchFromSheets(sheetsUrl); setNextRefresh(syncInterval * 60); }} style={{ background:"none", border:"none", color:"#2E7D5F", fontSize:"10px", cursor:"pointer", padding:"0 2px" }}>↻</button>
            </div>
          )}
          <label htmlFor="xlsx-import" style={{ padding:"5px 10px", background:"rgba(201,169,110,0.08)", border:"1px solid rgba(201,169,110,0.3)", color:"#C9A96E", fontFamily:"monospace", fontSize:"8px", letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", borderRadius:"2px", whiteSpace:"nowrap" }}>
            {tenders !== TENDERS ? "✓ Imported" : "↑ Import .xlsx"}
          </label>
          <input id="xlsx-import" type="file" accept=".xlsx,.xls" onChange={handleImport} style={{ display:"none" }} />
        </div>
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{ background:"none", border:"none", borderBottom:activeTab === id ? "2px solid #C9A96E" : "2px solid transparent", color:activeTab === id ? "#C9A96E" : "#6B6560", fontFamily:"monospace", fontSize:"9px", letterSpacing:"1px", textTransform:"uppercase", padding:"0 12px", cursor:"pointer", height:"56px", whiteSpace:"nowrap", transition:"all .15s", flexShrink:0, position:"relative" }}>
            <span style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              {label}
              {id === "archive" && archivedTenders.length > 0 && (
                <span style={{ background:"#2A2520", color:"#6B6560", fontSize:"7px", padding:"1px 5px", borderRadius:"8px", fontWeight:700 }}>{archivedTenders.length}</span>
              )}
            </span>
          </button>
        ))}
      </header>

      {/* ── TAB: TENDER INTELLIGENCE ── */}
      {activeTab === "tenders" && (
        <div style={{ padding:"24px 32px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1px", background:"#1E1C18", border:"1px solid #1E1C18", marginBottom:"20px" }}>
            {[{ n:openTenders.length, label:"Open Tenders", sub:"close date not yet passed", color:"#C9A96E" },{ n:openTenders.filter(t => t.kerbRelevance.startsWith("Direct")).length, label:"Direct Scope", sub:"highest ASK fit", color:"#2E7D5F" },{ n:openTenders.filter(t => t.urgent).length, label:"Closing This Week", sub:"act now", color:"#E05C4A" },{ n:filtered.length, label:"Showing", sub:"after filters", color:"#8A8078" }].map(s => (
              <div key={s.label} style={{ background:"#131210", padding:"18px 22px" }}>
                <div style={{ fontSize:"40px", fontWeight:700, color:s.color, lineHeight:1, marginBottom:"4px" }}>{s.n}</div>
                <div style={{ fontSize:"12px", fontWeight:600, color:"#E8E0D0", marginBottom:"2px" }}>{s.label}</div>
                <div style={{ fontFamily:"monospace", fontSize:"9px", color:"#6B6560" }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ background:"#131210", border:"1px solid #1E1C18", padding:"16px 20px", marginBottom:"8px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"14px", flexWrap:"wrap" }}>
              <div style={{ fontFamily:"monospace", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#6B6560" }}>Filters</div>
              {activeFilterCount > 0 && <button onClick={() => { setSearch(""); setFilterRegion("All"); setFilterCategory("All"); setFilterSite("All"); setFilterType("All"); setFilterRelevance("All"); setFilterUrgent(false); setBudgetRange("All"); }} style={{ background:"none", border:"1px solid #E05C4A", color:"#E05C4A", fontFamily:"monospace", fontSize:"8px", letterSpacing:"1px", textTransform:"uppercase", padding:"3px 10px", cursor:"pointer", borderRadius:"2px" }}>Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}</button>}
            </div>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search project, builder, location..." style={{ width:"100%", background:"#0D0C0A", border:"1px solid #2A2720", color:"#E8E0D0", fontFamily:"monospace", fontSize:"12px", padding:"9px 14px", outline:"none", borderRadius:"2px", marginBottom:"14px" }} />
            <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"14px", alignItems:"flex-end" }}>
              <FilterSelect label="Region" options={unique(tenders, "region")} value={filterRegion} onChange={setFilterRegion} />
              <FilterSelect label="Category" options={unique(tenders, "category")} value={filterCategory} onChange={setFilterCategory} />
              <FilterSelect label="Kerb & Channel" options={["All","Direct","Indirect"]} value={filterRelevance} onChange={setFilterRelevance} />
              <FilterSelect label="Value" options={budgetRanges} value={budgetRange} onChange={setBudgetRange} />
              <FilterSelect label="Tender Site" options={unique(tenders, "tenderSite")} value={filterSite} onChange={setFilterSite} />
              <FilterSelect label="Tender Type" options={unique(tenders, "tenderType")} value={filterType} onChange={setFilterType} />
              <FilterSelect label="Sort By" options={["closes","distance","budget","name"]} value={sortBy} onChange={setSortBy} />
            </div>
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
              <span style={{ fontFamily:"monospace", fontSize:"8px", letterSpacing:"1.5px", textTransform:"uppercase", color:"#3A3530", alignSelf:"center" }}>Quick:</span>
              <Pill label="🔴 Closing This Week" active={filterUrgent} onClick={() => setFilterUrgent(!filterUrgent)} />
              <Pill label="✦ Direct Scope" active={filterRelevance === "Direct"} onClick={() => setFilterRelevance(filterRelevance === "Direct" ? "All" : "Direct")} />
              <Pill label="Gold Coast" active={filterRegion === "Gold Coast"} onClick={() => setFilterRegion(filterRegion === "Gold Coast" ? "All" : "Gold Coast")} />
              <Pill label="Brisbane" active={filterRegion === "Brisbane"} onClick={() => setFilterRegion(filterRegion === "Brisbane" ? "All" : "Brisbane")} />
              <Pill label="Civil" active={filterCategory === "Civil"} onClick={() => setFilterCategory(filterCategory === "Civil" ? "All" : "Civil")} />
              <Pill label="SAP Ariba" active={filterSite === "SAP Ariba"} onClick={() => setFilterSite(filterSite === "SAP Ariba" ? "All" : "SAP Ariba")} />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 200px 120px 80px 80px 90px 90px 110px 160px", gap:"8px", padding:"8px 14px", borderBottom:"1px solid #1E1C18", marginBottom:"4px" }}>
            {["Project / Region","Summary","Builder","Budget","Dist","K&C Scope","Closes","Status","Action"].map(h => (
              <div key={h} style={{ fontFamily:"monospace", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", color:"#3A3530" }}>{h}</div>
            ))}
          </div>
          {filtered.length === 0
            ? <div style={{ padding:"40px", textAlign:"center", color:"#3A3530", fontFamily:"monospace", fontSize:"12px" }}>No tenders match current filters</div>
            : filtered.map(t => <TenderCard key={t.id} tender={t} onFollowUp={setModal} pipelineData={pipelineData} />)
          }
          {importStatus && <div style={{ marginTop:"10px", padding:"8px 14px", background:"#131210", border:"1px solid #1E1C18", fontFamily:"monospace", fontSize:"10px", color:importStatus === "success" ? "#2E7D5F" : "#E05C4A" }}>{importMsg}</div>}
        </div>
      )}

      {/* ── TAB: COUNCIL PORTALS ── */}
      {activeTab === "councils" && (
        <div style={tabPad}>
          <PT title="Council Tender Portals" sub="All councils confirmed — VendorPanel is your primary platform (6 of 7 councils). Brisbane uses SAP Ariba only." />
          <SL mt="0">VendorPanel Councils — Already Your Platform</SL>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"12px", marginBottom:"24px" }}>
            {COUNCILS_DATA.map(c => (
              <div key={c.id} style={{ background:"#131210", border:"1px solid #1E1C18", padding:"16px 18px", display:"flex", gap:"14px" }}>
                <div style={{ width:"40px", height:"40px", background:"#1E1C18", border:"1px solid #2A2720", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace", fontSize:"11px", fontWeight:700, color:"#C9A96E", flexShrink:0 }}>{c.id}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:"13px", marginBottom:"3px" }}>{c.name}</div>
                  <div style={{ fontFamily:"monospace", fontSize:"9px", color:"#C9A96E", letterSpacing:"0.5px", marginBottom:"6px" }}><a href={c.href} target="_blank" rel="noreferrer" style={{ color:"#C9A96E", textDecoration:"none" }}>{c.url}</a></div>
                  <div style={{ fontSize:"11px", color:"#6B6560", lineHeight:"1.6", marginBottom:"8px" }}>{c.note}</div>
                  <div style={{ display:"flex", gap:"8px" }}>
                    <Badge label={c.status} color={c.statusColor} />
                    <Badge label={c.priority} color={c.priorityColor} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <SL>Brisbane City Council — Different Platform (Action Required)</SL>
          <div style={{ background:"#131210", border:"1px solid #1E1C18", borderLeft:"3px solid #C97530", padding:"20px 24px", marginBottom:"24px" }}>
            <div style={{ display:"flex", gap:"20px", alignItems:"flex-start" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:"14px", marginBottom:"8px", color:"#C97530" }}>⚠ Brisbane does NOT use VendorPanel</div>
                <p style={{ fontSize:"12px", color:"#6B6560", lineHeight:"1.65", margin:"0 0 14px" }}>Brisbane City Council uses SAP Ariba exclusively for all major tenders. VendorPanel shows minimal or no content for BCC. You need a separate supplier registration on the Ariba portal. There is currently an open tender for <strong style={{ color:"#E8E0D0" }}>Displacement Mitigation of Concrete Footpaths</strong> — this is a high capability match for AllState.</p>
                <div style={{ display:"flex", gap:"20px" }}>
                  <div>
                    <div style={{ fontFamily:"monospace", fontSize:"8px", color:"#6B6560", letterSpacing:"1px", marginBottom:"4px" }}>TENDER PORTAL</div>
                    <a href="https://www.brisbane.qld.gov.au/business/council-tenders-and-market-led-proposals/current-tenders" target="_blank" rel="noreferrer" style={{ color:"#C9A96E", fontFamily:"monospace", fontSize:"10px", letterSpacing:"0.5px" }}>brisbane.qld.gov.au/current-tenders</a>
                  </div>
                  <div>
                    <div style={{ fontFamily:"monospace", fontSize:"8px", color:"#6B6560", letterSpacing:"1px", marginBottom:"4px" }}>SUPPLIER REGISTRATION</div>
                    <a href="https://www.brisbane.qld.gov.au/business" target="_blank" rel="noreferrer" style={{ color:"#C9A96E", fontFamily:"monospace", fontSize:"10px", letterSpacing:"0.5px" }}>brisbane.qld.gov.au/business</a>
                  </div>
                </div>
              </div>
              <div style={{ flexShrink:0, textAlign:"center", background:"#1E1C18", padding:"16px 20px", border:"1px solid #2A2720" }}>
                <div style={{ fontFamily:"monospace", fontSize:"24px", fontWeight:700, color:"#C97530" }}>SAP</div>
                <div style={{ fontFamily:"monospace", fontSize:"9px", color:"#6B6560" }}>ARIBA</div>
                <div style={{ marginTop:"8px", fontSize:"10px", color:"#6B6560" }}>Register<br/>separately</div>
              </div>
            </div>
          </div>

          <SL>VendorPanel Category Subscriptions — Set These Up Now</SL>
          <Card style={{ marginBottom:"24px" }}>
            <p style={{ fontSize:"12px", color:"#6B6560", margin:"0 0 14px", lineHeight:"1.65" }}>In your VendorPanel Marketplace account, subscribe to these categories across all 6 VP councils so you receive automatic alerts for RFQs, RFTs and EOIs that match AllState's scope:</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px" }}>
              {VP_CATEGORIES.map(cat => (
                <div key={cat.name} style={{ background:"#1E1C18", border:"1px solid #2A2720", padding:"12px 14px" }}>
                  <div style={{ fontWeight:600, fontSize:"12px", marginBottom:"4px" }}>{cat.name}</div>
                  <div style={{ fontSize:"11px", color:"#6B6560" }}>{cat.note}</div>
                </div>
              ))}
            </div>
          </Card>

          <SL>EstimateOne — Builder-Led Packages to Track</SL>
          <Card>
            <p style={{ fontSize:"12px", color:"#6B6560", margin:"0 0 12px", lineHeight:"1.65" }}>Use EstimateOne to find builder-led civil/landscaping packages where AllState can be listed as preferred kerbing subcontractor. Priority builders:</p>
            <div style={g2}>
              {[["Hutchinson Builders","Listed in ASK capability statement · Track their EstimateOne packages for civil, streetscapes, parks, community amenities"],["Morris Property Group","Listed in ASK capability statement · Residential estate civil works · Track subdivision packages"]].map(([n,d]) => (
                <div key={n} style={{ background:"#1E1C18", border:"1px solid #2A2720", padding:"12px 14px" }}>
                  <div style={{ fontWeight:600, marginBottom:"4px" }}>{n}</div>
                  <div style={{ fontSize:"11px", color:"#6B6560" }}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"12px", padding:"10px 12px", background:"#0D0C0A", borderLeft:"2px solid #C9A96E", fontSize:"11px", color:"#6B6560" }}>
              <strong style={{ color:"#E8E0D0" }}>EstimateOne keywords to set:</strong> footpath upgrade · streetscape · kerb & channel · road civil · open space · park upgrade · subdivision civil · landscaping civil
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: CAPABILITY MAP ── */}
      {activeTab === "capabilities" && (
        <div style={tabPad}>
          <PT title="Capability Assessment" sub="Based on AllState Kerbing Capability Statement · Mapped against council tender categories and competitor strengths" />
          <SL mt="0">Core Strengths</SL>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px", marginBottom:"20px" }}>
            {CAPABILITIES.strong.map(c => (
              <div key={c.name} style={{ background:"#131210", border:"1px solid #1E1C18", borderLeft:"3px solid #2E7D5F", padding:"12px 14px" }}>
                <div style={{ fontWeight:600, fontSize:"12px", color:"#E8E0D0", marginBottom:"3px" }}>{c.name}</div>
                <div style={{ fontFamily:"monospace", fontSize:"8px", color:"#2E7D5F", letterSpacing:"1px", marginBottom:"4px", textTransform:"uppercase" }}>Core Strength</div>
                <div style={{ fontSize:"11px", color:"#6B6560" }}>{c.note}</div>
              </div>
            ))}
          </div>
          <SL>Moderate / Developing</SL>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px", marginBottom:"20px" }}>
            {CAPABILITIES.moderate.map(c => (
              <div key={c.name} style={{ background:"#131210", border:"1px solid #1E1C18", borderLeft:"3px solid #C97530", padding:"12px 14px" }}>
                <div style={{ fontWeight:600, fontSize:"12px", color:"#E8E0D0", marginBottom:"3px" }}>{c.name}</div>
                <div style={{ fontFamily:"monospace", fontSize:"8px", color:"#C97530", letterSpacing:"1px", marginBottom:"4px", textTransform:"uppercase" }}>Moderate</div>
                <div style={{ fontSize:"11px", color:"#6B6560" }}>{c.note}</div>
              </div>
            ))}
          </div>
          <SL>Gaps — Action Required</SL>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px", marginBottom:"24px" }}>
            {CAPABILITIES.gaps.map(c => (
              <div key={c.name} style={{ background:"#131210", border:"1px solid #1E1C18", borderLeft:"3px solid #E05C4A", padding:"12px 14px" }}>
                <div style={{ fontWeight:600, fontSize:"12px", color:"#E8E0D0", marginBottom:"3px" }}>{c.name}</div>
                <div style={{ fontFamily:"monospace", fontSize:"8px", color:"#E05C4A", letterSpacing:"1px", marginBottom:"4px", textTransform:"uppercase" }}>Gap — Action Required</div>
                <div style={{ fontSize:"11px", color:"#6B6560" }}>{c.note}</div>
              </div>
            ))}
          </div>
          <SL>Capability vs Council Tender Requirements</SL>
          <Card style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"11px", whiteSpace:"nowrap" }}>
              <thead>
                <tr style={{ borderBottom:"1px solid #2A2720" }}>
                  {["Capability","Gold Coast","Logan","Ipswich","Redland","Sunshine Coast","Scenic Rim","Brisbane"].map(h => (
                    <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontFamily:"monospace", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", color:"#6B6560", fontWeight:400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CAP_MATRIX.map((row, i) => (
                  <tr key={row.cap} style={{ borderBottom:"1px solid #1E1C18", background:i % 2 === 0 ? "transparent" : "#0F0E0B" }}>
                    <td style={{ padding:"8px 12px", fontWeight:600, color:"#E8E0D0", fontSize:"11px" }}>{row.cap}</td>
                    {[["gc",row.gc,row.gcC],["lc",row.lc,row.lcC],["ip",row.ip,row.ipC],["re",row.re,row.reC],["sc",row.sc,row.scC],["sr",row.sr,row.srC],["bc",row.bc,row.bcC]].map(([k,v,c]) => (
                      <td key={k} style={{ padding:"8px 12px", color:c, fontFamily:"monospace", fontSize:"10px" }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ── TAB: COMPETITORS ── */}
      {activeTab === "competitors" && (
        <div style={tabPad}>
          <PT title="Competitor Intelligence" sub="SEQ Kerbing & Civil Market · Harris Slipforming removed (no longer operating) · Verified competitor data" />
          <SL mt="0">Major Civil Competitors</SL>
          <Card style={{ overflowX:"auto", marginBottom:"16px" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"11px" }}>
              <thead>
                <tr style={{ borderBottom:"1px solid #2A2720" }}>
                  {["Competitor","Services","Regions","Threat","Their Advantage","ASK Counter"].map(h => (
                    <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontFamily:"monospace", fontSize:"8px", letterSpacing:"1.5px", textTransform:"uppercase", color:"#6B6560", fontWeight:400, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MAJOR_COMPETITORS.map((c, i) => (
                  <tr key={c.name} style={{ borderBottom:"1px solid #1E1C18", background:i % 2 === 0 ? "transparent" : "#0F0E0B" }}>
                    <td style={{ padding:"10px 10px" }}><div style={{ fontWeight:600, fontSize:"12px", color:"#E8E0D0" }}>{c.name}</div><div style={{ fontSize:"10px", color:"#6B6560", marginTop:"2px" }}>{c.sub}</div></td>
                    <td style={{ padding:"10px 10px", color:"#6B6560", fontSize:"11px", maxWidth:"160px" }}>{c.services}</td>
                    <td style={{ padding:"10px 10px", color:"#8A8078", fontSize:"11px", whiteSpace:"nowrap" }}>{c.regions}</td>
                    <td style={{ padding:"10px 10px" }}><ThreatBadge t={c.threat} /></td>
                    <td style={{ padding:"10px 10px", color:"#6B6560", fontSize:"11px", maxWidth:"180px" }}>{c.advantage}</td>
                    <td style={{ padding:"10px 10px", color:"#E8E0D0", fontSize:"11px", maxWidth:"180px" }}>{c.counter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <SL>Local / Residential Competitors</SL>
          <Card style={{ overflowX:"auto", marginBottom:"24px" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"11px" }}>
              <thead>
                <tr style={{ borderBottom:"1px solid #2A2720" }}>
                  {["Competitor","Services","Region","Threat","Their Advantage","ASK Position"].map(h => (
                    <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontFamily:"monospace", fontSize:"8px", letterSpacing:"1.5px", textTransform:"uppercase", color:"#6B6560", fontWeight:400, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LOCAL_COMPETITORS.map((c, i) => (
                  <tr key={c.name} style={{ borderBottom:"1px solid #1E1C18", background:i % 2 === 0 ? "transparent" : "#0F0E0B" }}>
                    <td style={{ padding:"10px 10px" }}><div style={{ fontWeight:600, fontSize:"12px", color:"#E8E0D0" }}>{c.name}</div><div style={{ fontSize:"10px", color:"#6B6560", marginTop:"2px" }}>{c.sub}</div></td>
                    <td style={{ padding:"10px 10px", color:"#6B6560", fontSize:"11px" }}>{c.services}</td>
                    <td style={{ padding:"10px 10px", color:"#8A8078", fontSize:"11px", whiteSpace:"nowrap" }}>{c.regions}</td>
                    <td style={{ padding:"10px 10px" }}><ThreatBadge t={c.threat} /></td>
                    <td style={{ padding:"10px 10px", color:"#6B6560", fontSize:"11px" }}>{c.advantage}</td>
                    <td style={{ padding:"10px 10px", color:"#E8E0D0", fontSize:"11px" }}>{c.counter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <SL>Where Competitors Beat ASK — Summary</SL>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px" }}>
            {COMP_GAPS.map(g => (
              <div key={g.title} style={{ background:"#131210", border:"1px solid #1E1C18", borderTop:`2px solid ${g.level === "HIGH" ? "#E05C4A" : "#C97530"}`, padding:"14px 16px" }}>
                <div style={{ fontWeight:600, marginBottom:"6px", fontSize:"12px" }}>{g.title}</div>
                <div style={{ fontSize:"11px", color:"#6B6560", lineHeight:"1.6", marginBottom:"8px" }}>{g.detail}</div>
                <Badge label={g.level === "HIGH" ? "High gap" : "Medium gap"} color={g.level === "HIGH" ? "#E05C4A" : "#C97530"} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: MARKETING GAPS ── */}
      {activeTab === "gaps" && (
        <div style={tabPad}>
          <PT title="Marketing Gap Analysis" sub="6 identified gaps between AllState Kerbing's current positioning and what wins council tenders · Ranked by impact" />
          <SL mt="0">High Priority Gaps</SL>
          <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginBottom:"24px" }}>
            {MKT_GAPS.filter(g => g.priority === "HIGH").map(g => (
              <div key={g.n} style={{ background:"#131210", border:"1px solid #1E1C18", borderLeft:`3px solid #E05C4A`, padding:"20px 24px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px", gap:"20px" }}>
                  <div style={{ fontWeight:700, fontSize:"14px", color:"#E8E0D0" }}>{g.n}. {g.title}</div>
                  <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
                    <Badge label={`Effort: ${g.effort}`} color="#8A8078" />
                    <Badge label={`Impact: ${g.impact}`} color="#E05C4A" />
                    <Badge label={g.timeframe} color="#C9A96E" />
                  </div>
                </div>
                <p style={{ fontSize:"12px", color:"#6B6560", lineHeight:"1.7", margin:"0 0 12px" }}>{g.body}</p>
                <div style={{ background:"#0D0C0A", border:"1px solid #1E1C18", borderLeft:"2px solid #2E7D5F", padding:"10px 14px", fontSize:"12px", color:"#C0B8A8", lineHeight:"1.65" }}>
                  <strong style={{ color:"#2E7D5F" }}>Action: </strong>{g.action}
                </div>
              </div>
            ))}
          </div>
          <SL>Medium Priority Gaps</SL>
          <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginBottom:"24px" }}>
            {MKT_GAPS.filter(g => g.priority === "MED").map(g => (
              <div key={g.n} style={{ background:"#131210", border:"1px solid #1E1C18", borderLeft:"3px solid #C97530", padding:"20px 24px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px", gap:"20px" }}>
                  <div style={{ fontWeight:700, fontSize:"14px", color:"#E8E0D0" }}>{g.n}. {g.title}</div>
                  <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
                    <Badge label={`Effort: ${g.effort}`} color="#8A8078" />
                    <Badge label={`Impact: ${g.impact}`} color="#C97530" />
                    <Badge label={g.timeframe} color="#C9A96E" />
                  </div>
                </div>
                <p style={{ fontSize:"12px", color:"#6B6560", lineHeight:"1.7", margin:"0 0 12px" }}>{g.body}</p>
                <div style={{ background:"#0D0C0A", border:"1px solid #1E1C18", borderLeft:"2px solid #2E7D5F", padding:"10px 14px", fontSize:"12px", color:"#C0B8A8", lineHeight:"1.65" }}>
                  <strong style={{ color:"#2E7D5F" }}>Action: </strong>{g.action}
                </div>
              </div>
            ))}
          </div>
          <SL>Consolidated Action Matrix</SL>
          <Card style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"11px" }}>
              <thead>
                <tr style={{ borderBottom:"1px solid #2A2720" }}>
                  {["Gap","Competitor Leading","Effort","Impact","Timeframe"].map(h => (
                    <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontFamily:"monospace", fontSize:"8px", letterSpacing:"1.5px", textTransform:"uppercase", color:"#6B6560", fontWeight:400, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MKT_GAPS.map((g, i) => (
                  <tr key={g.n} style={{ borderBottom:"1px solid #1E1C18", background:i % 2 === 0 ? "transparent" : "#0F0E0B" }}>
                    <td style={{ padding:"8px 12px", fontWeight:600, color:"#E8E0D0" }}>{g.title}</td>
                    <td style={{ padding:"8px 12px", color:"#6B6560" }}>{g.competitor}</td>
                    <td style={{ padding:"8px 12px" }}><Badge label={g.effort} color={g.effort === "Very Low" || g.effort === "Low" ? "#2E7D5F" : g.effort === "Medium" ? "#C97530" : "#E05C4A"} /></td>
                    <td style={{ padding:"8px 12px" }}><Badge label={g.impact} color={g.impact === "High" ? "#E05C4A" : "#C97530"} /></td>
                    <td style={{ padding:"8px 12px", fontFamily:"monospace", fontSize:"10px", color:"#C9A96E" }}>{g.timeframe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ── TAB: ACTION TIMELINE ── */}
      {activeTab === "timeline" && (
        <div style={tabPad}>
          <PT title="Action Timeline & Roadmap" sub="AllState Kerbing · March 2026 → FY2027 · SEQ Multi-Council Expansion Strategy" />
          <div style={{ display:"flex", flexDirection:"column", gap:"2px", marginBottom:"32px" }}>
            {TIMELINE.map(t => (
              <div key={t.phase} style={{ display:"flex", gap:"0" }}>
                <div style={{ width:"140px", flexShrink:0, background:"#131210", border:"1px solid #1E1C18", borderRight:"none", padding:"16px 14px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                  <div style={{ fontFamily:"monospace", fontSize:"11px", fontWeight:700, color:t.pColor, marginBottom:"2px" }}>{t.phase}</div>
                  <div style={{ fontFamily:"monospace", fontSize:"9px", color:"#6B6560" }}>{t.date}</div>
                  <div style={{ marginTop:"6px" }}><Badge label={t.priority} color={t.pColor} /></div>
                </div>
                <div style={{ flex:1, background:"#131210", border:"1px solid #1E1C18", padding:"16px 20px" }}>
                  <div style={{ fontWeight:700, fontSize:"13px", color:"#E8E0D0", marginBottom:"4px" }}>{t.title}</div>
                  <div style={{ fontSize:"11px", color:"#6B6560", marginBottom:"10px" }}>{t.desc}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
                    {t.steps.map((step, si) => (
                      <div key={si} style={{ display:"flex", gap:"8px", alignItems:"flex-start" }}>
                        <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:t.pColor, flexShrink:0, marginTop:"6px" }} />
                        <div style={{ fontSize:"11px", color:"#8A8078", lineHeight:"1.6" }}>{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <SL>90-Day Priority Checklist</SL>
          <div style={g2}>
            <div style={{ background:"#131210", border:"1px solid #1E1C18", padding:"18px 20px" }}>
              <div style={{ fontWeight:600, marginBottom:"12px", color:"#C9A96E", fontSize:"12px" }}>Week 1–2 · Do Today</div>
              {CHECKLIST_WEEK.map((item, i) => {
                const key = `w${i}`;
                return (
                  <div key={i} onClick={() => toggleCheck(key)} style={{ display:"flex", gap:"10px", alignItems:"flex-start", padding:"6px 0", cursor:"pointer", borderBottom:"1px solid #1E1C18" }}>
                    <div style={{ width:"14px", height:"14px", border:`1px solid ${checklist[key] ? "#2E7D5F" : "#2A2720"}`, background:checklist[key] ? "#2E7D5F" : "transparent", borderRadius:"2px", flexShrink:0, marginTop:"2px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {checklist[key] && <span style={{ color:"#131210", fontSize:"10px", fontWeight:700 }}>✓</span>}
                    </div>
                    <div style={{ fontSize:"11px", color:checklist[key] ? "#3A3530" : "#8A8078", textDecoration:checklist[key] ? "line-through" : "none", lineHeight:"1.5" }}>{item}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ background:"#131210", border:"1px solid #1E1C18", padding:"18px 20px" }}>
              <div style={{ fontWeight:600, marginBottom:"12px", color:"#C97530", fontSize:"12px" }}>Month 1–3 · Priority Actions</div>
              {CHECKLIST_MONTH.map((item, i) => {
                const key = `m${i}`;
                return (
                  <div key={i} onClick={() => toggleCheck(key)} style={{ display:"flex", gap:"10px", alignItems:"flex-start", padding:"6px 0", cursor:"pointer", borderBottom:"1px solid #1E1C18" }}>
                    <div style={{ width:"14px", height:"14px", border:`1px solid ${checklist[key] ? "#2E7D5F" : "#2A2720"}`, background:checklist[key] ? "#2E7D5F" : "transparent", borderRadius:"2px", flexShrink:0, marginTop:"2px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {checklist[key] && <span style={{ color:"#131210", fontSize:"10px", fontWeight:700 }}>✓</span>}
                    </div>
                    <div style={{ fontSize:"11px", color:checklist[key] ? "#3A3530" : "#8A8078", textDecoration:checklist[key] ? "line-through" : "none", lineHeight:"1.5" }}>{item}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: ACTIVE PIPELINE ── */}
      {activeTab === "pipeline" && (
        <div style={{ padding:"28px 32px" }}>
          <PT title="Active Pipeline" sub="Tenders currently being reviewed, bid, or submitted · Set status on any tender in the Tender Intelligence tab" />

          {/* Pipeline stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:"1px", background:"#1E1C18", border:"1px solid #1E1C18", marginBottom:"24px" }}>
            {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
              const count = tenders.filter(t => pipelineData[t.id]?.status === status).length;
              return (
                <div key={status} style={{ background:"#131210", padding:"14px 16px", borderTop:`2px solid ${cfg.color}` }}>
                  <div style={{ fontSize:"28px", fontWeight:700, color:cfg.color, lineHeight:1, marginBottom:"4px" }}>{count}</div>
                  <div style={{ fontFamily:"monospace", fontSize:"9px", color:"#6B6560", letterSpacing:"1px", textTransform:"uppercase" }}>{status}</div>
                </div>
              );
            })}
          </div>

          {activeTenders.length === 0 ? (
            <div style={{ background:"#131210", border:"1px solid #1E1C18", borderLeft:"3px solid #C9A96E", padding:"28px 32px", textAlign:"center" }}>
              <div style={{ fontSize:"14px", fontWeight:600, color:"#E8E0D0", marginBottom:"8px" }}>No active tenders yet</div>
              <div style={{ fontFamily:"monospace", fontSize:"11px", color:"#6B6560", lineHeight:"1.7" }}>Update the <strong style={{ color:"#C9A96E" }}>Status</strong> column in your Google Sheet for any tender.<br/>Set it to Reviewing, Bidding or Submitted — it will appear here within 3 minutes automatically.</div>
            </div>
          ) : (
            <>
              {/* Kanban columns */}
              {["Reviewing","Bidding","Submitted"].map(status => {
                const cfg = STATUS_CONFIG[status];
                const group = activeTenders.filter(t => pipelineData[t.id]?.status === status);
                if (group.length === 0) return null;
                return (
                  <div key={status} style={{ marginBottom:"28px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
                      <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:cfg.color }} />
                      <div style={{ fontFamily:"monospace", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:cfg.color, fontWeight:700 }}>{status}</div>
                      <div style={{ fontFamily:"monospace", fontSize:"9px", color:"#6B6560" }}>— {group.length} tender{group.length !== 1 ? "s" : ""}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                      {group.map(t => {
                        const pd = pipelineData[t.id] || {};
                        return (
                          <div key={t.id} style={{ background:"#131210", border:`1px solid ${cfg.color}44`, borderLeft:`3px solid ${cfg.color}`, padding:"16px 20px", display:"grid", gridTemplateColumns:"1fr 140px 120px 120px 160px", gap:"16px", alignItems:"center" }}>
                            <div>
                              <div style={{ fontWeight:600, fontSize:"12px", color:"#E8E0D0", marginBottom:"3px", lineHeight:"1.3" }}>{t.name}</div>
                              <div style={{ fontFamily:"monospace", fontSize:"9px", color:"#6B6560" }}>{t.region} · {t.tenderSite} · {t.budget}</div>
                              {(t.summary || t.kerbRelevance) && <div style={{ fontSize:"10px", color:"#8A8078", marginTop:"4px", fontStyle:"italic", lineHeight:"1.4" }}>{(() => { const s = t.summary || t.kerbRelevance || ""; return s.length > 100 ? s.substring(0,98)+"…" : s; })()}</div>}
                              {pd.notes && <div style={{ fontSize:"11px", color:"#C9A96E", marginTop:"4px", fontStyle:"italic" }}>"{pd.notes}"</div>}
                            </div>
                            <div>
                              <div style={{ fontFamily:"monospace", fontSize:"8px", color:"#6B6560", letterSpacing:"1px", marginBottom:"3px" }}>CLOSES</div>
                              <div style={{ fontFamily:"monospace", fontSize:"11px", color: t.urgent ? "#E05C4A" : "#E8E0D0", fontWeight:600 }}>{t.closes}</div>
                              {pd.deadline && <div style={{ fontFamily:"monospace", fontSize:"9px", color:"#C97530", marginTop:"2px" }}>Due: {pd.deadline}</div>}
                            </div>
                            <div>
                              <div style={{ fontFamily:"monospace", fontSize:"8px", color:"#6B6560", letterSpacing:"1px", marginBottom:"3px" }}>OWNER</div>
                              <div style={{ fontSize:"11px", color: pd.owner ? "#E8E0D0" : "#3A3530" }}>{pd.owner || "— Unassigned"}</div>
                            </div>
                            <div>
                              <div style={{ fontFamily:"monospace", fontSize:"8px", color:"#6B6560", letterSpacing:"1px", marginBottom:"4px" }}>UPDATE PIPELINE</div>
                              <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSKLmBtPdvgmuTBTkCE8AjE3acbGJJu_gG3tkN3L_SBsYzB6sNAUCcYRdBxaxEAubGX2CnRJnWyK1wJ/pub?gid=1164355083&single=true&output=csv" target="_blank" rel="noreferrer"
                                style={{ display:"block", padding:"7px 10px", background:"rgba(201,169,110,0.08)", border:"1px solid rgba(201,169,110,0.4)", color:"#C9A96E", fontFamily:"monospace", fontSize:"8px", letterSpacing:"1px", textTransform:"uppercase", borderRadius:"2px", textDecoration:"none", textAlign:"center" }}>
                                ↗ Edit in Google Sheet
                              </a>
                              <div style={{ fontFamily:"monospace", fontSize:"8px", color:"#6B6560", marginTop:"6px", lineHeight:"1.5" }}>Auto-refreshes<br/>every {syncInterval}min</div>
                            </div>
                            <div style={{ display:"none" }} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Won / Lost / Pass summary */}
              {["Won","Lost","Pass"].some(s => activeTenders.some(t => pipelineData[t.id]?.status === s)) && (
                <>
                  <SL>Completed / Closed</SL>
                  <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
                    {activeTenders.filter(t => ["Won","Lost","Pass"].includes(pipelineData[t.id]?.status)).map(t => {
                      const pd = pipelineData[t.id] || {};
                      const cfg = STATUS_CONFIG[pd.status];
                      return (
                        <div key={t.id} style={{ background:"#131210", border:"1px solid #1E1C18", borderLeft:`3px solid ${cfg.color}`, padding:"10px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", opacity:0.7 }}>
                          <div>
                            <span style={{ fontSize:"12px", color:"#8A8078" }}>{t.name}</span>
                            <span style={{ fontFamily:"monospace", fontSize:"9px", color:"#6B6560", marginLeft:"12px" }}>{t.region} · {t.closes}</span>
                          </div>
                          <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                            {pd.owner && <span style={{ fontFamily:"monospace", fontSize:"9px", color:"#6B6560" }}>{pd.owner}</span>}
                            <span style={{ padding:"2px 8px", background:cfg.bg, border:`1px solid ${cfg.color}`, color:cfg.color, fontFamily:"monospace", fontSize:"8px", fontWeight:700, borderRadius:"2px" }}>{cfg.label}</span>
                            <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSKLmBtPdvgmuTBTkCE8AjE3acbGJJu_gG3tkN3L_SBsYzB6sNAUCcYRdBxaxEAubGX2CnRJnWyK1wJ/pub?gid=1164355083&single=true&output=csv" target="_blank" rel="noreferrer" style={{ background:"none", border:"1px solid #2A2720", color:"#6B6560", fontFamily:"monospace", fontSize:"8px", padding:"2px 8px", cursor:"pointer", borderRadius:"2px", textDecoration:"none" }}>Edit</a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          <div style={{ marginTop:"20px", padding:"12px 16px", background:"#131210", border:"1px solid #1E1C18", fontSize:"11px", color:"#6B6560", lineHeight:"1.7" }}>
            <strong style={{ color:"#E8E0D0" }}>How it works:</strong> Status, Owner, Notes and Deadline are read directly from your Google Sheet. Update any of those columns in the sheet — the dashboard auto-refreshes every 3 minutes and the pipeline updates automatically. Hit ↻ in the header for an instant refresh.
          </div>
        </div>
      )}

      {/* ── TAB: SETUP ── */}
      {activeTab === "archive" && (
        <div style={{ padding:"28px 32px" }}>
          {/* ── Header ── */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"24px" }}>
            <div>
              <div style={{ fontSize:"20px", fontWeight:700, color:"#E8E0D0", marginBottom:"4px" }}>📁 Archived Tenders</div>
              <div style={{ fontFamily:"monospace", fontSize:"11px", color:"#6B6560" }}>
                Close date has passed · {archivedTenders.length} tenders archived · Active tenders remain in Tender Intelligence
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
              <input
                type="text"
                placeholder="Search archived…"
                value={archiveSearch}
                onChange={e => setArchiveSearch(e.target.value)}
                style={{ background:"#1A1812", border:"1px solid #2A2720", color:"#E8E0D0", fontFamily:"monospace", fontSize:"11px", padding:"8px 12px", outline:"none", borderRadius:"2px", width:"220px" }}
              />
            </div>
          </div>

          {/* ── Stat row ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"24px" }}>
            {[
              { n: archivedTenders.length, label:"Total Archived", color:"#6B6560" },
              { n: archivedTenders.filter(t => t.status === "Won").length, label:"Won", color:"#2E7D5F" },
              { n: archivedTenders.filter(t => t.status === "Lost").length, label:"Lost", color:"#E05C4A" },
              { n: archivedTenders.filter(t => !t.status || t.status === "Pass" || t.status === "").length, label:"Not Pursued", color:"#4A5568" },
            ].map(({ n, label, color }) => (
              <div key={label} style={{ background:"#131210", border:`1px solid #1E1C18`, borderLeft:`3px solid ${color}`, padding:"14px 18px" }}>
                <div style={{ fontSize:"26px", fontWeight:700, color, marginBottom:"2px" }}>{n}</div>
                <div style={{ fontFamily:"monospace", fontSize:"9px", letterSpacing:"1.5px", textTransform:"uppercase", color:"#6B6560" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* ── Table ── */}
          {(() => {
            const search = archiveSearch.toLowerCase();
            const rows = archivedTenders
              .filter(t => !search || [t.name, t.builder, t.region, t.category].some(s => s.toLowerCase().includes(search)))
              .sort((a, b) => b.closesSort - a.closesSort); // most recently closed first

            const STATUS_CONFIG = {
              "Reviewing":{ color:"#C9A96E", bg:"rgba(201,169,110,0.12)" },
              "Bidding":  { color:"#C97530", bg:"rgba(201,117,48,0.12)" },
              "Submitted":{ color:"#4A90D9", bg:"rgba(74,144,217,0.12)" },
              "Won":      { color:"#2E7D5F", bg:"rgba(46,125,95,0.12)" },
              "Lost":     { color:"#E05C4A", bg:"rgba(224,92,74,0.12)" },
              "Pass":     { color:"#6B6560", bg:"rgba(107,101,96,0.12)" },
            };

            if (rows.length === 0) return (
              <div style={{ textAlign:"center", padding:"60px 0", color:"#3A3530", fontFamily:"monospace", fontSize:"12px" }}>
                {archivedTenders.length === 0 ? "No archived tenders yet — tenders move here automatically once their close date passes." : "No results match your search."}
              </div>
            );

            return (
              <div style={{ border:"1px solid #1E1C18" }}>
                {/* Column headers */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 160px 100px 90px 90px 110px 120px", gap:"8px", padding:"8px 14px", background:"#0D0C0A", borderBottom:"1px solid #1E1C18" }}>
                  {["Project", "Builder", "Budget", "Region", "Closed", "Source", "Outcome"].map(h => (
                    <div key={h} style={{ fontFamily:"monospace", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", color:"#4A4540" }}>{h}</div>
                  ))}
                </div>
                {rows.map((t, i) => {
                  const cfg = STATUS_CONFIG[t.status];
                  return (
                    <div key={t.id} style={{ display:"grid", gridTemplateColumns:"1fr 160px 100px 90px 90px 110px 120px", gap:"8px", padding:"10px 14px", background: i % 2 === 0 ? "#131210" : "#0F0E0B", borderBottom:"1px solid #1A1812", alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:"12px", color:"#8A8078", fontWeight:500, lineHeight:"1.3", marginBottom:"2px" }}>{t.name}</div>
                        <div style={{ fontFamily:"monospace", fontSize:"9px", color:"#3A3530" }}>{t.category}</div>
                      </div>
                      <div style={{ fontSize:"11px", color:"#6B6560" }}>{t.builder.split("/")[0].trim()}</div>
                      <div style={{ fontFamily:"monospace", fontSize:"10px", color:"#6B6560" }}>{t.budget}</div>
                      <div style={{ fontFamily:"monospace", fontSize:"10px", color:"#6B6560" }}>{t.region}</div>
                      <div style={{ fontFamily:"monospace", fontSize:"10px", color:"#4A4540" }}>{t.closes}</div>
                      <div style={{ fontFamily:"monospace", fontSize:"9px", color:"#4A4540" }}>{t.tenderSite}</div>
                      <div>
                        {cfg
                          ? <span style={{ display:"inline-block", padding:"2px 8px", background:cfg.bg, border:`1px solid ${cfg.color}`, color:cfg.color, fontFamily:"monospace", fontSize:"8px", letterSpacing:"1px", fontWeight:700, borderRadius:"2px" }}>{t.status}</span>
                          : <span style={{ fontFamily:"monospace", fontSize:"8px", color:"#2A2520" }}>— not set</span>
                        }
                        {t.owner && <div style={{ fontFamily:"monospace", fontSize:"8px", color:"#3A3530", marginTop:"2px" }}>{t.owner}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === "setup" && (
        <div style={{ padding:"28px 32px", maxWidth:"720px" }}>
          <PT title="Setup & Configuration" sub="Follow-up emails · Live Google Sheets data feed" />

          <SL mt="0">Follow-Up Emails</SL>
          <div style={{ background:"#131210", border:"1px solid #1E1C18", borderLeft:"3px solid #2E7D5F", padding:"16px 20px", marginBottom:"20px" }}>
            <div style={{ fontWeight:600, fontSize:"13px", color:"#E8E0D0", marginBottom:"6px" }}>✓ Zero setup required — works right now</div>
            <div style={{ fontSize:"12px", color:"#8A8078", lineHeight:"1.7" }}>
              Click <strong style={{ color:"#C9A96E" }}>Interested — Follow Up</strong> on any tender. A pre-filled email draft opens in Outlook (or whatever your default mail app is) addressed to <strong style={{ color:"#C9A96E" }}>tender@askerbing.com.au</strong> with the tender name, close date, budget, region and kerb scope already in the body. Just add any extra notes and hit send.
            </div>
          </div>
          {[["1","Click 'Interested — Follow Up'","Find the tender in the Tender Intelligence tab and click the gold button on the right side of the row."],["2","Email opens pre-filled in Outlook","Your default mail app opens with To, Subject and body already populated — tender name, closes date, budget, region and kerb scope."],["3","Add notes and send","Type any extra context in the Notes field in the modal before opening, then send from Outlook as normal."]].map(([n,title,desc]) => (
            <div key={n} style={{ display:"flex", gap:"16px", background:"#131210", border:"1px solid #1E1C18", padding:"14px 18px", marginBottom:"6px" }}>
              <div style={{ width:"26px", height:"26px", borderRadius:"50%", background:"#C9A96E", color:"#131210", fontSize:"14px", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{n}</div>
              <div><div style={{ fontWeight:600, fontSize:"13px", marginBottom:"3px" }}>{title}</div><div style={{ fontSize:"12px", color:"#6B6560", lineHeight:"1.6" }}>{desc}</div></div>
            </div>
          ))}
          <div style={{ height:"28px" }} />
          <SL>Live Google Sheets Data Feed</SL>
          {liveStatus === "live" && <div style={{ background:"#131210", border:"1px solid #1E1C18", borderLeft:"3px solid #2E7D5F", padding:"12px 16px", marginBottom:"16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}><span style={{ fontFamily:"monospace", fontSize:"11px", color:"#2E7D5F" }}>✓ Live — {tenders.length} tenders synced at {lastSync} · Refreshing every {syncInterval}min</span><button onClick={() => fetchFromSheets(sheetsUrl)} style={{ background:"rgba(46,125,95,0.1)", border:"1px solid #2E7D5F", color:"#2E7D5F", fontFamily:"monospace", fontSize:"9px", letterSpacing:"1px", textTransform:"uppercase", padding:"5px 12px", cursor:"pointer", borderRadius:"2px" }}>↻ Sync Now</button></div>}
          {[["1","Get your Google Sheets CSV URL","Open AllState_Live_Tender_Feed in Google Sheets → File → Share → Publish to web → Sheet: Tenders → Format: CSV → Publish → copy URL."],["2","Set up the auto-parser","Option A: Import AllState_Make_Blueprint.json into make.com. Option B: Paste the Google Apps Script code from the Excel into Extensions → Apps Script (100% free, runs hourly)."],["3","Enable email alerts on each platform","EstimateOne: Saved Searches → email alerts on. VendorPanel: Settings → Notifications → on. SAP Ariba: Notification preferences. QTenders: Subscribe."],["4","Paste CSV URL below and Save","Dashboard loads tender data from this URL on each refresh."]].map(([n,title,desc]) => (
            <div key={n} style={{ display:"flex", gap:"16px", background:"#131210", border:"1px solid #1E1C18", padding:"14px 18px", marginBottom:"6px" }}>
              <div style={{ width:"26px", height:"26px", borderRadius:"50%", background:"#2E7D5F", color:"#131210", fontSize:"14px", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{n}</div>
              <div><div style={{ fontWeight:600, fontSize:"13px", marginBottom:"3px" }}>{title}</div><div style={{ fontSize:"12px", color:"#6B6560", lineHeight:"1.6" }}>{desc}</div></div>
            </div>
          ))}
          <Card style={{ marginTop:"16px" }}>
            <div style={{ fontFamily:"monospace", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#6B6560", marginBottom:"10px" }}>Google Sheets CSV URL</div>
            <input type="text" value={sheetsUrl} onChange={e => setSheetsUrl(e.target.value)} placeholder="https://docs.google.com/spreadsheets/d/.../pub?gid=0&single=true&output=csv" style={{ width:"100%", background:"#0D0C0A", border:"1px solid #2A2720", color:"#E8E0D0", fontFamily:"monospace", fontSize:"11px", padding:"10px 12px", outline:"none", borderRadius:"2px", marginBottom:"12px" }} />
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={() => saveSheetsUrl(sheetsUrl)} style={{ background:"#2E7D5F", border:"none", color:"#FFFFFF", fontFamily:"monospace", fontSize:"10px", letterSpacing:"1.5px", textTransform:"uppercase", padding:"11px 22px", cursor:"pointer", fontWeight:700, borderRadius:"2px" }}>Save & Connect</button>
              {sheetsUrl && <button onClick={() => { setSheetsUrl(""); try { localStorage.removeItem("ask_sheets_url"); } catch {} setTenders(TENDERS); setLiveStatus(null); setLiveMsg(""); }} style={{ background:"none", border:"1px solid #2A2720", color:"#6B6560", fontFamily:"monospace", fontSize:"9px", letterSpacing:"1px", textTransform:"uppercase", padding:"11px 16px", cursor:"pointer", borderRadius:"2px" }}>Disconnect</button>}
            </div>
            {liveStatus === "error" && <div style={{ marginTop:"10px", fontFamily:"monospace", fontSize:"10px", color:"#E05C4A" }}>{liveMsg}</div>}
          </Card>
          <div style={{ height:"20px" }} />
          <Card>
            <div style={{ fontFamily:"monospace", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#6B6560", marginBottom:"10px" }}>Auto-Sync Interval</div>
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"12px" }}>
              {[5, 10, 15, 30].map(mins => (
                <button key={mins} onClick={() => { setSyncInterval(mins); try { localStorage.setItem("ask_sync_interval", mins.toString()); } catch {} }} style={{ padding:"8px 16px", background: syncInterval === mins ? "#2E7D5F" : "#131210", border:`1px solid ${syncInterval === mins ? "#2E7D5F" : "#2A2720"}`, color: syncInterval === mins ? "#FFFFFF" : "#8A8078", fontFamily:"monospace", fontSize:"10px", cursor:"pointer", borderRadius:"2px", fontWeight: syncInterval === mins ? 700 : 400 }}>
                  {mins} min
                </button>
              ))}
            </div>
            <div style={{ fontSize:"11px", color:"#6B6560", lineHeight:"1.6" }}>
              How often the dashboard should check Google Sheets for updates. Default: 5 minutes. Lower intervals use more bandwidth but ensure fresher data.
            </div>
          </Card>
        </div>
      )}

      {modal && <FollowUpModal tender={modal} onClose={() => setModal(null)} />}
    </div>
    </>
  );
}
