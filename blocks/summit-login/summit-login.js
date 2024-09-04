// import * as jose from "https://cdnjs.cloudflare.com/ajax/libs/jose/5.2.3/index.js";
import {SignJWT} from 'https://cdnjs.cloudflare.com/ajax/libs/jose/5.2.3/jwt/sign.js';

waitForElement('.nav-sections[data-section-status="loaded"]').then((elm) => {
    var signoutButton = document.querySelector('li > a[title="Sign out"]');
    var loginButton = document.querySelector('li > a[title="Login"]');
    var cookieName = "polaris-delivery-token";
    var comingSoonPlaceHolder = window.location.origin + "/resources/summit/coming-soon.jpeg";
    var errorLoadingPlaceHolder = window.location.origin + "/resources/summit/loading.jpeg";

    // JWT related variables
    var securedImages = [];
    var secretKey = "cm-p129624-e1269699";
    var JWTexpiry = "2024-05-26T20:28:33.213+05:30";
    var roles = "admin";

    function logOutUser() {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.querySelector("input[name='uname']").value = '';
        document.querySelector("input[name='psw']").value = '';
        toggleLoginButtons();
        updateUserName();
        updateImageLinks();
    }

    function logInUser() {
        var username = document.querySelector("input[name='uname']").value;
        var password = document.querySelector("input[name='psw']").value;
        if (username && password) {
            document.querySelector(".login-error").setAttribute("hidden", "");
            generateJwtAndUpdateDOM();
        } else {
            document.querySelector('.user-input').closest(".nav-drop").click();
            document.querySelector(".login-error").removeAttribute("hidden");
        }
    }

    function isLoggedIn() {
        return document.cookie.indexOf(cookieName) != -1;
    }

    function toggleLoginButtons() {
        if(isLoggedIn()) {
            // user is logged in
            loginButton.closest("li").setAttribute("hidden", "");
            signoutButton.parentElement.removeAttribute("hidden", "");
        } else {
            // user is anonymous
            loginButton.closest("li").removeAttribute("hidden", "");
            signoutButton.parentElement.setAttribute("hidden", "");
        }
    }

    function styleUpTheLimitedEdition() {
        var limitedEdition = Array.from(document.querySelectorAll("li")).filter((el) => el.innerHTML.indexOf("Limited") != -1)[0];
        limitedEdition.style.color= "red";
        limitedEdition.style.fontWeight = "bold";
        // limitedEdition.addEventListener("click", (event) => {
        //     window.location.href = "/furniture-street#limited-editions";
        // });
    }

    function appendLoginForm() {
        var loginMarkup = '<div class="login-form">' +
                            '<form action="action_page.php" method="post">' +
                                '<div class="container">' +
                                    '<div class="user-input">' +
                                        '<label for="uname"><b>Username</b></label>' +
                                        '<input type="text" placeholder="Enter Username" name="uname" required>' +
                                        '<label for="psw"><b>Password</b></label>' +
                                        '<input type="password" placeholder="Enter Password" name="psw" required>' +
                                    '</div>' +    
                                    '<button class="login-button" type="submit">Login</button>' +
                                    '<br>' +
                                    '<div class="login-error" hidden>' +
                                        '<span style="color: red;">Please enter username and password<span/>' +
                                        '<br>' +
                                    '</div>' +
                                    '<label>' +
                                        '<input type="checkbox" checked="checked" name="remember"> Remember me' +
                                    '</label>' +
                                '</div>' +
                            '</form>' +
                        '</div>';                     
        loginButton.parentElement.innerHTML = loginMarkup;
        loginButton = document.querySelector('.login-button');
    }

    function addEventListeners() {
        signoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            logOutUser();
        });
        loginButton.addEventListener('click', (event) => {
            event.preventDefault();
            logInUser();
        });
        document.querySelector(".user-input").addEventListener("click", (event) => {
            document.querySelector('.user-input').closest(".nav-drop").click();
        });
        if (window.location.pathname.indexOf("furniture-street") != -1) {
            document.querySelector(".popular-collections img").addEventListener("click", (event) => {
                if(window.location.pathname.indexOf("v2/") == -1) {
                    window.location.href = "/product/sofa-set";
                } else {
                    window.location.href = "/v2/product/sofa-set";
                }
            });
        }
    }

    function updateUserName() {
        var userIconEle = loginButton.closest("ul").parentElement;
        var username = "User\n";
        if (isLoggedIn()) {
            username = document.querySelector("input[name='uname']").value || "User";
            userIconEle.childNodes[0].textContent = "Hey " + username + "!\n";
        } else {
            userIconEle.childNodes[0].textContent = "Sign In";
        }
    }

    // ToDo : this part need to be udpated with decorator
    function updateImageLinks() {
        try {
         var deliveryToken = document.cookie.split(';').filter((item) => item.indexOf(cookieName) != -1)[0].split('=')[1];
        } catch (e) {
            // do nothind as user is logged out hence no cookie is found
        }
        securedImages.forEach((img) => {
            if(isLoggedIn()) {
                var srcUrl = img.parentElement.getAttribute("data-original-source");
                fetch(srcUrl, {
                    headers: {
                        'x-asset-delivery-token' : deliveryToken
                    }
                }).then(resp => resp.blob())
                .then(blob => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const base64Data = reader.result;
                            img.setAttribute("src" , base64Data);
                            img.parentElement.querySelectorAll("source").forEach((el) => {
                                el.setAttribute("srcset", base64Data);
                            });
                        };
                        reader.readAsDataURL(blob);
                });
                if (img.width == 0 || img.src == comingSoonPlaceHolder) {
                    img.setAttribute("src" , errorLoadingPlaceHolder);
                    img.parentElement.querySelectorAll("source").forEach((el) => {
                        el.setAttribute("srcset", errorLoadingPlaceHolder);
                    });
                }
            } else {
                img.setAttribute("src" , comingSoonPlaceHolder);
                img.parentElement.querySelectorAll("source").forEach((el) => {
                    el.setAttribute("srcset", comingSoonPlaceHolder);
                });
            }
        });

        const templates = document.querySelectorAll("[data-is-template=true]");
        const params = {
          name: isLoggedIn() ? document.querySelector("input[name='uname']").value : "Guest",
          guest: isLoggedIn() ? 0 : 1
        }

        templates.forEach((template) => {
            template.querySelectorAll("img").forEach((img) => {
                const oldSrc = img.getAttribute("src");
                img.setAttribute("src", oldSrc.replace(/\$(name|guest)=([^&]*)/g, function(match, p1) {
                  return `$${p1}=${params[p1]}`;
                }));
            });

            template.querySelectorAll("source").forEach((source) => {
                const oldSrcset = source.getAttribute("srcset");
                source.setAttribute("srcset", oldSrcset.replace(/\$(name|guest)=([^&]*)/g, function(match, p1) {
                  return `$${p1}=${params[p1]}`;
                }));
            });
        });
    }

    function matchesPolarisDeliveryUrl(srcUrl) {
        // code to match regex for host matching "delivery-pxxxx-exxxx" and URI starts with either adobe/assets/deliver or adobe/dynamicmedia/deliver
        //const regex = /^(https?:\/\/delivery-p[0-9]+-e[0-9-cmstg]+\.adobeaemcloud\.com\/(adobe\/assets\/deliver|adobe\/dynamicmedia\/deliver)\/(.*))/gm;
        return true;
    }

    // ToDo : this part need to be udpated with decorator
    function identifySecuredImages() {
        document.querySelectorAll("picture img").forEach((img) => {
            //if(!img.getAttribute("width") && matchesPolarisDeliveryUrl(img.getAttribute("src"))) {
            if(img.getAttribute('src').includes(comingSoonPlaceHolder) || matchesPolarisDeliveryUrl(img.getAttribute("src"))) {    
                securedImages.push(img);
                var srcUrl = img.getAttribute("src");
                if(img.parentElement.getAttribute('data-original-source') == null) {
                    img.parentElement.setAttribute("data-original-source", srcUrl);
                }
            }
        });
        console.log("Total secured images found : " + securedImages.length);
        var securedHost = new URL(document.querySelector("picture[data-original-source]:not([data-original-source=''])").getAttribute("data-original-source")).host;
        secretKey = securedHost.replace("delivery", "cm").replace("-cmstg.adobeaemcloud.com", "").replace(".adobeaemcloud.com", "");
    }

function generateJwtAndUpdateDOM() {
        // Define the secret key
        const secret = new TextEncoder().encode(secretKey);
    
        // Define the JWT header
        const header = {
            "alg": "HS256",
            "typ": "JWT"
        };
    
        // Define the JWT claims
        const jwtClaims = {
            "roles": roles,
            "expiry": JWTexpiry
        };
 
        // new jose.SignJWT(jwtClaims)
        new SignJWT(jwtClaims)
            .setProtectedHeader(header)
            .sign(secret)
            .then((token) => {
                document.cookie = cookieName + "=" + token + "; expires=Thu, 01 Jan 2970 00:00:00 UTC; path=/;";
                toggleLoginButtons();
                updateUserName();
                updateImageLinks();
                console.log('JWT generated successfully : ' + token);
            });
    }

    function updatePDPdetails() {
        var RedTheme = Array.from(document.querySelectorAll(".summit-pdp-bg-theme div div")).filter((el) => el.innerHTML.indexOf("Red") != -1)[0];
        RedTheme.addEventListener('click', (event) => {
            var picture = document.querySelector(".summit-pdp picture");
            var imgUrl = "https://s7g10.scene7.com/is/image/genaibeta?layer=0&src=ai(genaibeta/LeatherSofa?genReplace=bg,red%20wall%20with%20sunlight%20and%20shadows&op_gen=get)";
            picture.querySelector("img").setAttribute("src", imgUrl);
            picture.querySelectorAll("source").forEach((el) => {
                el.setAttribute("srcset", imgUrl);
            });
        });

        var yellowTheme = Array.from(document.querySelectorAll(".summit-pdp-bg-theme div div")).filter((el) => el.innerHTML.indexOf("Yellow") != -1)[0];
        yellowTheme.addEventListener('click', (event) => {
            var picture = document.querySelector(".summit-pdp picture");
            var imgUrl = "https://s7g10.scene7.com/is/image/genaibeta?layer=0&src=ai(genaibeta/LeatherSofa?genReplace=bg,yellow%20wall%20with%20shadows%20and%20sunlight&op_gen=get)";
            picture.querySelector("img").setAttribute("src", imgUrl);
            picture.querySelectorAll("source").forEach((el) => {
                el.setAttribute("srcset", imgUrl);
            });
        });

        var greyTheme = Array.from(document.querySelectorAll(".summit-pdp-bg-theme div div")).filter((el) => el.innerHTML.indexOf("Grey") != -1)[0];
        greyTheme.addEventListener('click', (event) => {
            var picture = document.querySelector(".summit-pdp picture");
            var imgUrl = "https://s7g10.scene7.com/is/image/genaibeta?layer=0&src=ai(genaibeta/LeatherSofa?genReplace=bg,grey%20wall%20with%20shadows%20and%20sunlight&op_gen=get)";
            picture.querySelector("img").setAttribute("src", imgUrl);
            picture.querySelectorAll("source").forEach((el) => {
                el.setAttribute("srcset", imgUrl);
            });
        });

        var blueTheme = Array.from(document.querySelectorAll(".summit-pdp-bg-theme div div")).filter((el) => el.innerHTML.indexOf("Blue") != -1)[0];
        blueTheme.addEventListener('click', (event) => {
            var picture = document.querySelector(".summit-pdp picture");
            var imgUrl = "https://s7g10.scene7.com/is/image/genaibeta?layer=0&src=ai(genaibeta/LeatherSofa?genReplace=bg,blue%20wall%20with%20sunlight%20and%20shadows&op_gen=get)";
            picture.querySelector("img").setAttribute("src", imgUrl);
            picture.querySelectorAll("source").forEach((el) => {
                el.setAttribute("srcset", imgUrl);
            });
        });
    }

    function changeCursorOnHover() {
        document.querySelectorAll("img").forEach((el) => {
            el.addEventListener("mouseover", (event) => {
                el.style.cursor = "pointer";
            });
        });
    }

    function adjustDiscountTemplateCSS() {
        var discountImg = Array.from(document.querySelectorAll("img")).filter((img) => img.getAttribute("src").includes("/is/image/varun/Sofa1") == true)[0];
        discountImg.closest("picture").style.display = "grid";
    }

    function init() {
        //styleUpTheLimitedEdition();
        appendLoginForm();
        toggleLoginButtons();
        addEventListeners();
        updateUserName();
        identifySecuredImages();
        changeCursorOnHover();
        // adjustDiscountTemplateCSS();
        
        // Call the function to generate the JWT
        if(isLoggedIn()) {
            generateJwtAndUpdateDOM();
        }
        updateImageLinks();
        
        if(window.location.pathname.indexOf("sofa-set") != -1) updatePDPdetails();
        
    }

    init();
    // if(window.location.pathname.indexOf("furniture-street") != -1) init();
    // if(window.location.pathname.indexOf("sofa-set") != -1) updatePDPdetails();

});


function waitForElement(selector) {
  return new Promise((resolve) => {
      if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          return;
      }

      const observer = new MutationObserver(() => {
          if (document.querySelector(selector)) {
              observer.disconnect();
              resolve(document.querySelector(selector));
          }
      });

      // Observe changes in the entire document body (including subtree)
      observer.observe(document.body, { childList: true, subtree: true });
  });
}
