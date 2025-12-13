/**
 * Generates the HTML content for the profile page when the user is logged in.
 *
 * @returns {string} HTML content as a string
 */
export function createProfileLoggedIn(): string {
  return `<section
        class="w-full max-w-[1144px] h-fit bg-background flex flex-col items-center pt-4 pb-8 gap-8"
      >
         <div 
      class="name-container w-[90%] text-center h-fit" 
      id="name-container">
      <p id="name" alt="Name" class="break-all font-bold text-h3 sm:text-h1">Name</p>
      </div>
        <div class="w-[90%] md:w-full h-fit flex justify-end -mt-2">
          <div
            class="bg-black py-2 px-4 flex gap-2 justify-center items-center rounded-[50px] text-white h-fit -mt-6"
          >
            <p id="credits">0</p>
            <p>Credits</p>
          </div>
        </div>
        <div class="profile-header relative w-full h-fit flex justify-center">
          <div
            class="banner-container w-[90%] md:w-full h-auto bg-gray-300 animate-pulse overflow-hidden"
            id="banner-container"
          >
            <img
              id="banner"
              class="banner w-full h-[150px] sm:h-[200px] md:h-[300px] object-cover rounded-sm"
              alt="Banner"
              onload="this.parentElement.classList.remove('animate-pulse', 'bg-gray-300')"

              />
          </div>
          
          <div
            class="avatar-container absolute w-[90%] max-w-[150px] sm:max-w-[200px] md:max-w-[250px] h-auto -bottom-10 flex justify-center bg-gray-300 animate-pulse"
            id="avatar-container">
            
            <img
              id="avatar"
              class="avatar aspect-square object-cover rounded-full border-8 border-background"
              alt="Avatar"
              onload="this.parentElement.classList.remove('animate-pulse', 'bg-gray-300')"
              />
          </div>
        </div>
        <div
          class="email-container font-bold w-[90%] max-w-[386px] text-p mt-8 h-fit flex justify-center items-center"
        >
          <p class="break-all">Email@example.com</p>
        </div>

        <div
          id="bio-container"
          class="bio-container w-[90%] max-w-[400px] min-h-[63px] bg-gray-300 text-black text-p rounded-sm flex justify-center items-center p-4"
        >
          <p id="bio" class="bio"></p>
        </div>

        <div class="flex flex-col sm:flex-row w-[90%] h-fit justify-center items-center gap-4 mt-2">
        <button
          id="edit-profile-toggle-btn"
          class="h-[50px] w-[80%] xs:w-[302px] flex justify-center items-center bg-blue text-white font-bold text-center text-btn rounded-[50px] hover:bg-white hover:text-black hover:border-black border border-blue cursor-pointer"
          type="button"
        >
          Edit profile
        </button>
         <a
        href="/listing/create/index.html"
        class="h-[50px] w-[80%] xs:w-[302px] justify-center items-center flex bg-green text-white border-bg-green border hover:border-bg-green hover:bg-white hover:text-black font-bold text-center text-btn rounded-full"
      >
        <h1>+ Create listing</h1>
      </a>
      </div>
        <div
          class="bg-white w-[90%] w-sm:full max-w-[641px] min-h-[353px] py-8 px-4 xs:px-8 rounded-[10px] hidden"
          id="edit-profile-card"
        >
          <form class="profile-details-container flex flex-col gap-[15px]">
            <div class="inputfield-container">
              <label for="banner" class="form-label">Banner URL </label>
              <input
                id="banner-input"
                class="inputfield h-[50px] w-full rounded-md border border-gray-300 p-2 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Banner URL"
              />
              <span id="banner-input-info" class="text-grey text-underInput"
                >(Rectangle images preferred.)</span
              >
              <span
                id="banner-input-error"
                class="text-danger text-p italic"
              ></span>
            </div>
            <div class="inputfield-container">
              <label for="banner" class="form-label">Banner ALT text</label>
              <input
                id="banner-alt-input"
                class="inputfield h-[50px] w-full rounded-md border border-gray-300 p-2 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Banner ALT"
              />
               <span id="banner-alt-input-info" class="text-grey text-underInput"
                >(Describe your banner image, e.g. "Purple flower bouquet")</span>
              <span
                id="banner-alt-input-error"
                class="text-danger text-p italic"
              ></span>
            </div>
            <div class="inputfield-container">
              <label for="avatar" class="form-label">Avatar URL </label>
              <input
                id="avatar-input"
                class="inputfield h-[50px] w-full rounded-md border border-gray-300 p-2 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Avatar URL"
              />
              <span id="avatar-input-info" class="text-grey text-underInput"
                >(Square images preferred.)</span
              >
              <span
                id="avatar-input-error"
                class="text-danger text-p italic"
              ></span>
            </div>
            <div class="inputfield-container">
              <label for="avatar" class="form-label">Avatar ALT text </label>
              <input
                id="avatar-alt-input"
                class="inputfield h-[50px] w-full rounded-md border border-gray-300 p-2 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Avatar ALT"
              />
               <span id="avatar-alt-input-info" class="text-grey text-underInput"
                >(Describe your avatar image, e.g. "White fox in the snow")</span
              >
              <span
                id="avatar-alt-input-error"
                class="text-danger text-p italic"
              ></span>
            </div>

            <div class="inputfield-container">
              <label for="bio" class="form-label">Bio </label>
              <textarea
                id="bio-input"
                class="inputfield h-[100px] w-full rounded-md border border-gray-300 p-2 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Bio"
                maxlength="160"
              >
                </textarea>
                <div class="w-full flex xs:flex-row flex-col justify-between">
               
              <span id="bio-input-info" class="text-underInput text-grey w-full"
                >(Maximum be 160 characters.)</span
              >
                 <div class="flex w-fit h-fit justify-end text-grey">
                <p id="character-count">0</p>
                <p>/160</p>
                </div>
                </div>
              <span
                id="bio-input-error"
                class="text-danger text-p italic"
              ></span>
            </div>

            <div
              class="flex sm:flex-row flex-col-reverse mt-4 w-full h-fit gap-3 sm:gap-2 items-center sm:justify-between"
            >
              <button
                type="button"
                class="cancel-btn cursor-pointer  w-[90%] max-w-[190px] h-[50px] bg-grey rounded-[50px] hover:bg-white hover:text-black border-grey outline-1 hover:border-black text-white font-bold"
                id="cancel-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                id="edit-profile-btn"
                class="edit-profile-btn bg-blue h-[50px] max-w-[370px] w-[90%] mt-2 sm:mt-0 cursor-pointer rounded-[50px] p-2 text-white text-btn outline-1 hover:bg-white hover:text-black font-bold"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </section>
      <div class="w-[90%] md:w-full min-h-screen max-w-[1144px] ">
        <div class="w-full h-fit flex flex-col xs:flex-row justify-start gap-2 bg-gray-300 xs:bg-background rounded-t-2xl">
          <button
            class="tab-button active cursor-pointer text-btn"
            onclick="openTab(event, 'my-listings')"
          >
            My listings
          </button>
          <button
            class="tab-button cursor-pointer text-btn"
            onclick="openTab(event, 'bid-on')"
          >
            Bid on
          </button>
          <button
            class="tab-button cursor-pointer text-btn"
            onclick="openTab(event, 'wins')"
          >
            Wins
          </button>
        </div>

        <div id="my-listings" class="tab-content active">
          <section
            class="my-listings w-full h-fit bg-white p-3 sm:p-5 rounded-b-[20px] xs:rounded-tr-[20px] min-h-screen"
          >
            <div
              class="listings-container w-full h-min-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-5"
            ></div>
          </section>
        </div>

        <div id="bid-on" class="tab-content">
          <section
            class="w-full h-fit bg-white min-h-screen p-3 sm:p-5 rounded-b-[20px] rounded-tr-[20px]"
          >
            <div
              class="bid-on-container w-full h-min-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-5"
            ></div>
          </section>
        </div>
        <div id="wins" class="tab-content">
          <section
            class="w-full h-fit bg-white min-h-screen p-3 sm:p-5 rounded-b-[20px] rounded-tr-[20px]"
          >
            <div
              class="wins-container w-full h-min-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-5"
            ></div>
          </section>
        </div>
      </div>`;
}

/**
 * Generates the HTML content for the profile page when the user is logged out.
 *
 * @returns {string} HTML content as a string
 */
export function createProfileLoggedOut(): string {
  return `<section
        class="w-full max-w-[1144px] h-fit bg-background flex flex-col items-center pt-4 pb-8 gap-4"
      >
       <div 
      class="name-container w-full text-center h-fit px-2" 
      id="name-container">
      <p id="name" alt="Name" class="break-all font-bold text-h3 sm:text-h1">Name</p>
      </div>
        <div class="profile-header relative w-full h-fit flex justify-center mt-4">
          <div
            class="banner-container w-[90%] md:w-full h-auto bg-gray-300 animate-pulse"
            id="banner-container"
          >
            <img
              id="banner"
              class="banner w-full h-[200px] md:h-[300px] object-cover rounded-sm"
              alt="Banner"
              onload="this.parentElement.classList.remove('animate-pulse', 'bg-gray-300')"

            />
          </div>
        <div
            class="avatar-container absolute w-[90%] max-w-[150px] sm:max-w-[200px] md:max-w-[300px] h-auto -bottom-10 flex justify-center bg-gray-300 animate-pulse"
            id="avatar-container">
            
            <img
              id="avatar"
              class="avatar aspect-square object-cover rounded-full border-8 border-background"
              alt="Avatar"
              onload="this.parentElement.classList.remove('animate-pulse', 'bg-gray-300')"
              />
          </div>
        </div>
        <div
          class="email-container w-[90%] max-w-[386px] font-bold text-p mt-5 h-20 flex justify-center items-center"
        >
          <p class="break-all">Email@example.com</p>
        </div>

        <div
          id="bio-container"
          class="bio-container w-[90%] -mt-2 max-w-[400px] min-h-[63px] bg-gray-300 text-black text-p rounded-sm flex justify-center items-center p-4"
        >
          <p id="bio" class="bio"></p>
        </div>
       
        <div
          class="bg-white w-[90%] w-sm:full max-w-[641px] min-h-[353px] p-5 sm:p-10 rounded-[10px] hidden"
          id="edit-profile-card"
        >
        
        </div>
      </section>
      <div class="w-[90%] md:w-full min-h-screen max-w-[1144px] -mt-2">
        <div class="w-full h-fit flex flex-col sm:flex-row justify-start gap-2">
          <button
            class="tab-button active cursor-pointer text-btn"
            onclick="openTab(event, 'their-listings')"
          >
            Listings
          </button>
         
        </div>

        <div id="my-listings" class="tab-content active">
          <section
            class="my-listings w-full h-fit bg-white p-3 sm:p-5 rounded-b-[20px] rounded-tr-none sm:rounded-tr-[20px] min-h-screen"
          >
            <div
              class="listings-container w-full h-min-screen grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-5 "
            ></div>
          </section>
        </div>
      </div>`;
}
