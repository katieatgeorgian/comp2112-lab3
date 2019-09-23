const AVATAR_URL = "https://avatars0.githubusercontent.com/u/47111708?v=4";
const main = document.querySelector("main");
const tweetBtn = document.querySelector("form");
const myAvatar = [...document.querySelectorAll(".my_avatar")];
myAvatar.forEach(img => {
  img.src = AVATAR_URL;
});
const imgGifPoll = document.querySelector("#imgGifPoll");
const searchGifBtn = document.querySelector("#searchGifBtn");
const searchGif = document.querySelector("#searchGif");
const toggle = document.querySelector("input.custom-control-input");

// this will be our text and any images, gifs and polls the user posts
const tweets = [];

// these gifs will be displayed and will be a subset of originalGifs
// (but it's totally up to you how you want to implement it;
// you could for example just use originalGifs alone)
let gifs = [];

// these gifs are the original JSON we got from our fetch in case we need it
let originalGifs = [];

let gifsArrayOriginalSize = [];

let gifsStill = [];

// this will display all the objects in my tweets array
// where each object contains avatar url, username, name and text
function render() {
  main.innerHTML = tweets
    .map(
      tweet => `
        <aside>
         <div>
            <img class="avatar" src="${tweet.avatar}">
         </div>
         <div class="formatted-tweet">
            <h6><a href="https://twitter.com/${tweet.username}">${tweet.name}</a> <span class="username">@${tweet.username}</span></h6>
            <p>${tweet.tweet}</p>
            <div class="imgGifPoll">
            ${tweet.img}
            </div>
            <div>
                <section>
                    <div id="reactions" class="btn-group mr-2">
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-message-outline"
                            aria-label="reply"
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-twitter-retweet"
                            aria-label="retweet"
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-heart-outline"
                            aria-label="like"
                            style=""
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-upload"
                            aria-label="share"
                        ></button>
                    </div>
                </section>
            </div>
        </div>
        </aside>
          `
    )
    .join("");
}

function tweeting(e) {
  e.preventDefault();
  const p = document.querySelector("textarea");

  // store tweet text in tweets object
  tweets.unshift({
    avatar: AVATAR_URL,
    name: "Katie",
    username: "katieatgeorgian",
    tweet: p.value,
    img: imgGifPoll.innerHTML
  });

  // clear textbox and any image
  p.value = "";
  imgGifPoll.innerHTML = "";

  render();
}

// if user selects the image icon in order to insert an image from their comptuer
function handleFileSelect(evt) {
  const reader = new FileReader();

  reader.addEventListener("load", e => {
    imgGifPoll.innerHTML = `<img class="thumb" src="${e.target.result}" style="width: 100%"/>`;
  });

  // Read in the image file as a data URL.
  reader.readAsDataURL(evt.target.files[0]);
}

function fetchGifs() {
  // https://api.jsonbin.io/b/5d5bfa9b6343515e9d146880
  const API_KEY = "URSRgSXuGgvVg6LKFDlUsp0bWM80ansC";
  // http://api.giphy.com/v1/gifs/search?api_key=URSRgSXuGgvVg6LKFDlUsp0bWM80ansC&q=happy
  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchGif.value}`
  )
    .then(res => res.json())
    .then(data => {
      originalGifs = data.data;
      console.log(originalGifs);
      gifs = originalGifs
        .map(
          (gif, index) =>
            `<img data-index=${index} class="p-1" src=${gif.images.fixed_height_small.url}>`
        )
        .join("");
      gifsArrayOriginalSize = originalGifs.map(
        (gif, index) =>
          `<img data-index=${index} class="p-1 w-100" src=${gif.images.original.url}>`
      );
      gifsStill = originalGifs.map(
        (gif, index) =>
          `<img data-index=${index} class="p-1" src=${gif.images.fixed_height_small_still.url}>`
      );
      browsegifs.innerHTML = gifsStill;

      // unhide switch to toggle gif animations
      switchgifsarea.classList.remove("hide");
    });
}

function chooseGif(e) {
  e.preventDefault();
  if (e.target.matches("img")) {
    const index = e.target.dataset.index;
    console.log(index);
    let oneImage = `${gifsArrayOriginalSize[index]}`;
    imgGifPoll.innerHTML = oneImage;
    //closes modal
    $("#insertgif").modal("hide");
  } else {
    return;
  }
}

//function to switch between still photo and gif photos
function toggleGifs() {
  if (toggle.checked == true) {
    browsegifs.innerHTML = gifs;
  } else {
    browsegifs.innerHTML = gifsStill;
  }
}

// various click/change handlers for the icons and tweet button
document
  .querySelector("#uploadPic")
  .addEventListener("change", handleFileSelect, false);
tweetBtn.addEventListener("submit", tweeting);
searchGifBtn.addEventListener("click", fetchGifs);
browsegifs.addEventListener("click", chooseGif);
toggle.addEventListener("click", toggleGifs);
