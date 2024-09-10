const URL_ADDRESS = 'https://gateway.scan-interfax.ru'

document.addEventListener('DOMContentLoaded', () => {
    
    initAuth()
    loginCheck()
    infoRequest()
    initSwiper()
})

const initAuth = () => {
    let form = document.querySelector('.auth-form'),
        btn = form && form.querySelector('.submit-button'),
        input_login = form && form.querySelector('input[name=login]'),
        input_password = form && form.querySelector('input[name=password]'),
        input_login_value = input_login && input_login.value, 
        input_password_value = input_password && input_password.value

    input_login && input_login.addEventListener('input', () => {
        input_login_value = input_login.value
    })

    input_password && input_password.addEventListener('input', () => {
        input_password_value = input_password.value
    })

    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault()

            fetch(`${URL_ADDRESS}/api/v1/account/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Accept": "application/json"
                },
                body: JSON.stringify({login: input_login_value, password: input_password_value})
            })
            .then(res => res.json())
            .then((res) => {
                localStorage.setItem('accessToken', res.accessToken)
                window.location.href = './index.html'
            })
        })
    }
}

const loginCheck = () => {
    let currentCard = document.querySelector('[data-type="current_card"]'),
        loginedButton = document.querySelector('[data-type="logined_button"]')

    if (localStorage.getItem('accessToken')) {
        document.querySelector('body').classList.add('logined')
        currentCard && currentCard.classList.add('active')
        if (loginedButton) {
            loginedButton.style.display = 'flex'
        }
    } else {
        document.querySelector('body').classList.remove('logined')
        currentCard && currentCard.classList.remove('active')
        if (loginedButton) {
            loginedButton.style.display = 'none'
        }
    }

    let btn = document.querySelector('.sign-out')

    btn && btn.addEventListener('click', () => {
        localStorage.removeItem('accessToken')
        window.location.href = ''
    })
}

const infoRequest = () => {
    if (localStorage.getItem('accessToken')) {
        let companies = document.querySelector('[data-type="companies"]'),
            limit = document.querySelector('[data-type="limit"]'),
            companiesBlock = document.querySelector('.profile .info')

        fetch(`https://gateway.scan-interfax.ru/api/v1/account/info`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(res => res.json())
        .then((res) => {
            if (companiesBlock) {
                setTimeout(() => {
                    companiesBlock.classList.add('loaded')
                    companies.innerHTML = res.eventFiltersInfo.usedCompanyCount
                    limit.innerHTML = res.eventFiltersInfo.companyLimit
                }, 2000);
            }
           
        })
    }
}


const initSwiper = () => {
    let item = document.querySelector('.why-we')

    const swiper = item && new Swiper(item, {
        slidesPerView: 1,
        spaceBetween: 30,
        breakpoints: {
            900: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        },
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}