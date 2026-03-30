let innerUploadImage = document.querySelector(".inner-upload-image");
let input = innerUploadImage.querySelector("input");
let image = document.querySelector("#image");
let loading = document.querySelector("#loading");
let btn = document.querySelector("#submitButton");
let text = document.querySelector("#text");
let output = document.querySelector(".output");
let mathQuery = document.querySelector("#mathQuery");

const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyClTtKTsYi2R9CIiAwMim_G1t3TrLnIORM";

let fileDetails = {
    mime_type: null,
    data: null
};

async function generateResponse() {
    const queryText = mathQuery.value.trim();
    const hasFile = fileDetails.data !== null;

    if (!queryText && !hasFile) {
        alert("Please upload an image or enter a math query!");
        loading.style.display = "none";
        return;
    }

    const requestBody = {
        contents: [{
            parts: [
                { text: "Solve the mathematical problem with proper steps of solution" },
                ...(hasFile ? [{
                    inline_data: {
                        mime_type: fileDetails.mime_type,
                        data: fileDetails.data
                    }
                }] : []),
                ...(queryText ? [{ text: queryText }] : [])
            ]
        }]
    };

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    };

    try {
        let response = await fetch(Api_url, requestOptions);
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .trim();

        text.innerHTML = apiResponse;
        output.style.display = "block";
    } catch (e) {
        console.log(e);
    } finally {
        loading.style.display = "none";
    }
}

input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = (e) => {
        let base64data = e.target.result.split(",")[1];
        fileDetails.mime_type = file.type;
        fileDetails.data = base64data;

        innerUploadImage.querySelector("span").style.display = "none";
        innerUploadImage.querySelector("#icon").style.display = "none";
        image.style.display = "block";
        image.src = `data:${fileDetails.mime_type};base64,${fileDetails.data}`;
        output.style.display = "none";
    };
    reader.readAsDataURL(file);
});




btn.addEventListener("click", () => {
    loading.style.display = "block";
    generateResponse();
});

innerUploadImage.addEventListener("click", () => {
    input.click();
});
