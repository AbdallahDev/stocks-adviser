const mainEl = document.querySelector("main")

function makeInputArea() {
    let tickers = []
    const inputAreaEl = document.createElement('div')
    inputAreaEl.id = 'inputArea'

    const detailsTxtEl = document.createElement('p')
    detailsTxtEl.id = 'details'
    detailsTxtEl.textContent = "Add up to 3 stock tickers below to get a super accurate stock predictins report 👇"

    const tickerToolEl = document.createElement('div')
    tickerToolEl.id = "tickerTool"

    const tickerInputEl = document.createElement('input')
    tickerInputEl.type = "text"
    tickerInputEl.id = 'tickerInput'
    tickerInputEl.placeholder = "AAPL"
    tickerInputEl.addEventListener('input', () => {
        // here i'll check if the entered value is not empty
        // and the value is in english and the number of the entered values 
        // are less than 3 values
        if (tickerInputEl.value !== ""
            && tickerInputEl.value.match(/^[A-Z]+$/i) && tickers.length < 3)
            crossEl.disabled = false
        else {
            detailsTxtEl.textContent = "The thicker names should be in English without numbers, and at most three ones."
            detailsTxtEl.style.color = '#ef233c'
            crossEl.disabled = true
        }
    })

    const crossEl = document.createElement('button')
    crossEl.id = 'cross'
    crossEl.textContent = "+"
    crossEl.disabled = true
    crossEl.addEventListener('click', () => {
        const value = tickerInputEl.value.trim()
        if (value) {
            tickers.push(value.toUpperCase())
            tickerTxtEl.textContent = tickers.join(', ')
            tickerInputEl.value = ""
            //here i'll enable the upload btn, because there is a value has been 
            //inputed
            uploadBtnEl.disabled = false
            //here i'll disable the add button (cross) if the values
            //that has been inputed reached 3 values
            if (tickers.length === 3) {
                crossEl.disabled = true
                tickerInputEl.placeholder = "Max 3 input reached!"
                tickerInputEl.style.fontSize = "20px"
            }
        }
    })

    const tickerTxtEl = document.createElement('p')
    tickerTxtEl.id = 'tickerTxt'
    tickerTxtEl.textContent = "Your tickers will appears here..."

    const uploadBtnEl = document.createElement("button")
    uploadBtnEl.id = "uploadBtn"
    uploadBtnEl.textContent = "GENERATE REPORT"
    if (tickers.length === 0) uploadBtnEl.disabled = true
    uploadBtnEl.addEventListener('click', () => showData(tickers))

    tickerToolEl.append(tickerInputEl, crossEl)

    const noteTxtEl = document.createElement("p")
    noteTxtEl.id = 'noteTxt'
    noteTxtEl.textContent = "Always correct 15% of the time!"

    inputAreaEl.append(detailsTxtEl, tickerToolEl, tickerTxtEl, uploadBtnEl, noteTxtEl)
    mainEl.appendChild(inputAreaEl)
}

function getData(tickers) {
    makeLoadingArea()
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(tickers)
        }, 5000)
    })
}

function makeLoadingArea() {
    mainEl.innerHTML = `
        <div id="loadingArea">
            <div id="loadingIcon">
                <img src="images/loader.gif" alt="loader gif">
            </div>
            <div id="loadingTxt">Creating report...</div>
        </div>`
}

async function showData(tickers) {
    try {
        const result = await getData(tickers)
        makeReportArea(result)
    } catch (error) {
        console.error(error)
    }
}

function makeReportArea(tickers) {
    const reportAreaEl = document.createElement('div')
    reportAreaEl.id = 'reportArea'

    const titleEl = document.createElement('p')
    titleEl.id = "title"
    titleEl.textContent = "Your Report 💹"

    const reportEl = document.createElement("p")
    reportEl.id = "report"
    reportEl.textContent = tickers

    reportAreaEl.append(titleEl, reportEl)
    mainEl.innerHTML = ""
    mainEl.appendChild(reportAreaEl)
}

makeInputArea()

