import { API_KEY } from './config.js';

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

async function fetchData(tickers) {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
        makeLoadingArea()
        tickers = tickers.join(" ")
        console.log(tickers)
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `make me a report about these stocks ${tickers} if I should invest in them, and make it breif with at most 5 lines for each stock. and make each stock in a separate paragraph with a line white space break. and make the header of each paragraph bold`
                            }
                        ]
                    }
                ]
            })
        });

        const result = await response.json();

        // ملاحظة: قد تختلف بنية النتيجة قليلاً في إصدارات الـ Preview
        if (result.candidates && result.candidates[0].content) {
            console.log(result.candidates[0].content.parts[0].text);
            return result.candidates[0].content.parts[0].text;
        } else {
            console.log("Response structure:", result);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
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
        const result = await fetchData(tickers)
        makeReportArea(result)
    } catch (error) {
        console.error(error)
    }
}

function makeReportArea(report) {
    const reportAreaEl = document.createElement('div')
    reportAreaEl.id = 'reportArea'

    const titleEl = document.createElement('p')
    titleEl.id = "title"
    titleEl.textContent = "Your Report 💹"

    const reportEl = document.createElement("p")
    reportEl.id = "report"
    reportEl.textContent = report

    reportAreaEl.append(titleEl, reportEl)
    mainEl.innerHTML = ""
    mainEl.appendChild(reportAreaEl)
}

makeInputArea()

