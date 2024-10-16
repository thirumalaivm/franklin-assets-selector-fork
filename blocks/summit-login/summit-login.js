waitForElement('.nav-sections[data-section-status="loaded"]').then((elm) => {
    var signoutButton = document.querySelector('li > a[title="Sign out"]');
    var loginButton = document.querySelector('li > a[title="Login"]');
    var cookieName = "login-token";

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
            document.cookie = cookieName + "=randomVal; expires=Thu, 01 Jan 2970 00:00:00 UTC; path=/;";
            toggleLoginButtons();
            updateUserName();
            updateImageLinks();
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

    function init() {
        appendLoginForm();
        toggleLoginButtons();
        addEventListeners();
        updateUserName();
        changeCursorOnHover();
        
        if(isLoggedIn()) {
            document.cookie = cookieName + "=randomVal; expires=Thu, 01 Jan 2970 00:00:00 UTC; path=/;";
            toggleLoginButtons();
            updateUserName();
            updateImageLinks();
        }
        updateImageLinks();
        
        if(window.location.pathname.indexOf("sofa-set") != -1) updatePDPdetails();
        
    }

    init();

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
