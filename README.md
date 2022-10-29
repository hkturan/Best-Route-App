<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img src="https://user-images.githubusercontent.com/25109457/198842805-9502e712-ae9f-41aa-ab40-b213a443ceda.png" alt="Logo" width="128" height="128">

  
<h3 align="center">Best Route Application using <a href="https://www.tomtom.com/products/maps-navigation-apis-sdks/">TomTom API</a></h3>

  <p align="center">
    Choose your destination points from the map and find the best route
    <br />
    
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#introduction-video-click-to-play">Introduction Video</a></li>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a>
        </li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


## Introduction Video (Click to Play)

[![IMAGE ALT TEXT HERE](https://user-images.githubusercontent.com/25109457/198842519-9fa44ddf-7fa2-47a5-a7b2-b28937d472e9.png)](https://vimeo.com/765251253)

<!-- ABOUT THE PROJECT -->
## About The Project

The project was developed with angular 11 and aims to calculate the best route by optimizing the selected destination points.<a href="https://www.tomtom.com/products/maps-navigation-apis-sdks/">TomTom API</a> used for development. Project's abilities:

* Place markers on the map
* Move markers with drag and drop
* Name the markers
* Get live location
* Search by coordinate or place name
* Determine the start - end point of the route
* Set up to 10 intermediate destinations
* Edit the route after the best route has been calculated (changing order)
* Show route between 2 destinations with custom color
* Show route direction

---
<h4>Methods used<h4>
  
* <a href="https://developer.tomtom.com/routing-api/documentation/routing/calculate-route">Calculate Route</a> : Calculates a route between an origin and a destination
* <a href="https://developer.tomtom.com/routing-api/documentation/waypoint-optimization/waypoint-optimization">Waypoint Optimization</a> : Optimizes a provided waypoints sequence based on road network distances
  

**[⬆ back to top](#readme-top)**

### Built With

* ![Angular](https://badges.aleen42.com/src/angular.svg) 
* ![Typescript](https://badges.aleen42.com/src/typescript.svg) 

**[⬆ back to top](#readme-top)**

<!-- GETTING STARTED -->
## Getting Started

### Installation

1. <h4>Clone the repo</h4>

   ```sh
   git clone https://github.com/hkturan/Best-Route-App.git
   ```
2. <h4>Install Npm Packages (in Terminal)</h4>

   ```sh
   npm install
   ```
3. Set Your Tomtom Api Key in `src/app/helper/constants.ts`

   ```sh
   static readonly TOMTOM_API_KEY = '--YOUR_TOMTOM_API_KEY_HERE--';
   ```
   

3. <h4>Start Application (in Terminal)</h4>

   ```sh
   npm start
   ```
   ---
4. <h4>Select Start Point (Step 1 of Create Route)</h4>
   
   ![imageedit_2_8732827428](https://user-images.githubusercontent.com/25109457/198829861-30a9b541-89ba-4edb-80d0-125e63218be7.png)
   ---
   * <p>After the start point is selected</p>
   ![imageedit_2_7598192016](https://user-images.githubusercontent.com/25109457/198830051-af4462fe-20cf-4ff8-adda-d4c71b3131fb.png)
   
   ---
5. <h4>Select Destination Point(s) (Step 2 of Create Route)</h4>

   ![imageedit_2_4062864280](https://user-images.githubusercontent.com/25109457/198830629-ffa47fa4-3c16-4064-bf78-770b614d4e1c.png)
   ---
   * <p>After the destination points are selected</p>
   ![imageedit_7_6017005823](https://user-images.githubusercontent.com/25109457/198831979-e5efceab-187e-4406-9b40-ec2d6a944a6a.png)
   
   ---
6. <h4>Select End Point (Optional) (Step 3 of Create Route)</h4>

   ![imageedit_4_5117932459](https://user-images.githubusercontent.com/25109457/198831656-45d12e91-4480-49a2-8fcb-ea06f0e195e2.png)
   ---
   * <p>After the end point is selected</p>
   ![imageedit_5_2413072479](https://user-images.githubusercontent.com/25109457/198831659-e942f4d4-53e2-4766-8278-8e105e118fd1.png)
   
7. <h4>Preview Route Plan (Step 4 of Create Route)</h4>

   ![imageedit_8_2396896143](https://user-images.githubusercontent.com/25109457/198832035-b93d4f61-2289-42d5-b9df-12335bbb4f03.png)
   
   You can reorder the route plan
   
   ---
8. <h4> Best Route Plan is Ready!</h4>

   ![imageedit_9_2761687500](https://user-images.githubusercontent.com/25109457/198832267-1385f045-d57a-4811-a5d7-30320d867944.png)
   ---
   ![imageedit_10_5918341081](https://user-images.githubusercontent.com/25109457/198832268-c43982bc-16a5-4d5f-bb76-5b7615bccf62.png)
   ---

<h4>You can search by coordinate or place name</h4>

* <p>by Place Name</p>
![imageedit_12_3140777766](https://user-images.githubusercontent.com/25109457/198832548-6bb80c7b-10da-4ec0-87af-9a533ea41ab1.png)
---
* <p>by Coordinate</p>
![imageedit_13_6922188680](https://user-images.githubusercontent.com/25109457/198832550-83d3796c-5cc8-4330-8b94-2c0c55d15c20.png)
---

<h4>Marker Info</h4>

![imageedit_14_3892418615](https://user-images.githubusercontent.com/25109457/198832698-b5c1fbfe-8f1b-4b28-80e7-f0fd2aa4d998.png)

**[⬆ back to top](#readme-top)**

## License

[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)

Distributed under the MIT License. See LICENSE.txt for more information.

**[⬆ back to top](#readme-top)**

<!-- CONTACT -->
## Contact

Hasan Kaan TURAN  - hasankaanturan33@gmail.com

**[⬆ back to top](#readme-top)**
