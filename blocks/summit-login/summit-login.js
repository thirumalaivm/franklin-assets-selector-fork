import * as jose from "https://cdnjs.cloudflare.com/ajax/libs/jose/5.2.3/index.js";

waitForElement('.nav-sections[data-section-status="loaded"]').then((elm) => {
    var signoutButton = document.querySelector('li > a[title="Sign out"]');
    var loginButton = document.querySelector('li > a[title="Login"]');
    var cookieName = "polaris-delivery-token";
    var cookieValue = "some-random-token";
    var comingSoonPlaceHolder = window.location.origin + "/resources/summit/coming-soon.jpeg";
    var errorLoadingPlaceHolder = window.location.origin + "/resources/summit/oops-loading.jpeg";
    var securedImages = [];

    function logOutUser() {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.querySelector("input[name='uname']").value = '';
        document.querySelector("input[name='psw']").value = '';
        toggleLoginButtons();
        updateUserName();
        updateImageLinks();
    }

    function logInUser() {
        generateJwtAndUpdateDOM();
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
        limitedEdition.addEventListener("click", (event) => {
            window.location.href = "/furniture-street#limited-editions";
        });
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
    }

    function updateUserName() {
        var userIconEle = loginButton.closest("ul").parentElement;
        var username = "User\n";
        if (isLoggedIn()) {
            username = document.querySelector("input[name='uname']").value || "User";
            userIconEle.childNodes[1].textContent = "Hey " + username + "!\n";
        } else {
            userIconEle.childNodes[1].textContent = username + "\n";
        }
    }

    // ToDo : this part need to be udpated with decorator
    function updateImageLinks() {
        securedImages.forEach((img) => {
            if(isLoggedIn()) {
                var srcUrl = img.parentElement.getAttribute("data-original-source");
                fetch(srcUrl).then((resp) => {
                    if(resp.status == 200) {
                        img.setAttribute("src" , srcUrl);
                        img.parentElement.querySelectorAll("source").forEach((el) => {
                            el.setAttribute("srcset", srcUrl);
                        });
                    }
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
    }

    // ToDo : this part need to be udpated with decorator
    function identifySecuredImages() {
        document.querySelectorAll(".embed img[loading='lazy']").forEach((img) => {
            if(img.width == 0) {
                securedImages.push(img);
                var srcUrl = img.getAttribute("src");
                img.parentElement.setAttribute("data-original-source", srcUrl);
            }
        });
    }

    function generateJwtAndUpdateDOM() {
        // Define the secret key
        const secret = new TextEncoder().encode('cm-p30902-e145436');
    
        // Define the JWT header
        const header = {
            "alg": "HS256",
            "typ": "JWT"
        };
    
        // Define the JWT claims
        const jwtClaims = {
            "roles": "admin",
            "expiry": "2024-05-26T20:28:33.213+05:30",
        };
 
        new jose.SignJWT(jwtClaims)
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

    function init() {
        styleUpTheLimitedEdition();
        appendLoginForm();
        toggleLoginButtons();
        addEventListeners();
        updateUserName();
        identifySecuredImages();
        
        // Call the function to generate the JWT
        if(isLoggedIn()) generateJwtAndUpdateDOM();
        updateImageLinks();
    }

    init();

});


function waitForElement(selector) {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // Observe changes in the entire document body (including subtree)
        observer.observe(document.body, { childList: true, subtree: true });
    });
}