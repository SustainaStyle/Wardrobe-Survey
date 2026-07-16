const CONFIG = window.SURVEY_CONFIG;

const QUESTIONS = [{"en": "I have nothing to Wear, How often you feel?", "hi": "आपको कितनी बार लगता है कि मेरे पास पहनने के लिए कुछ नहीं है?", "en_options": ["Never / Rarely", "Sometimes", "Often", "Almost every day"], "hi_options": ["कभी नहीं", "कभी-कभी", "अक्सर", "लगभग हर दिन"]}, {"en": "I want to improve my style when I go out?", "hi": "जब मैं बाहर जाता/जाती हूँ, तो मैं अपनी स्टाइल बेहतर करना चाहता/चाहती हूँ?", "en_options": ["Never / Rarely", "Sometimes", "Often", "Almost every day"], "hi_options": ["कभी नहीं", "कभी-कभी", "अक्सर", "लगभग हर दिन"]}, {"en": "Do you ever feel your wardrobe is missing something but can't figure out what?", "hi": "क्या आपको कभी लगता है कि आपकी अलमारी में कुछ कमी है, लेकिन समझ नहीं आता कि क्या?", "en_options": ["Never / Rarely", "Sometimes", "Often", "Almost every day"], "hi_options": ["कभी नहीं", "कभी-कभी", "अक्सर", "लगभग हर दिन"]}, {"en": "How often do you plan outfits in advance for specific occasions or events?", "hi": "विशेष अवसरों या कार्यक्रमों के लिए आप कितनी बार पहले से कपड़े तय करते हैं?", "en_options": ["Never", "Sometimes", "Often", "Always"], "hi_options": ["कभी नहीं", "कभी-कभी", "अक्सर", "हमेशा"]}, {"en": "Do you have clothes in your wardrobe that you have never worn or rarely wear?", "hi": "क्या आपकी अलमारी में ऐसे कपड़े हैं जिन्हें आपने कभी नहीं पहना या बहुत कम पहनते हैं?", "en_options": ["Yes, many", "Yes, a few", "Very few", "No"], "hi_options": ["हाँ, बहुत सारे", "हाँ, कुछ", "बहुत कम", "नहीं"]}, {"en": "How many clothes in your wardrobe do you feel no longer suit your style?", "hi": "आपकी अलमारी में कितने कपड़े अब आपकी स्टाइल के अनुसार नहीं हैं?", "en_options": ["Many", "Some", "Very few", "None"], "hi_options": ["बहुत सारे", "कुछ", "बहुत कम", "एक भी नहीं"]}, {"en": "Do you ever feel that something is missing from your wardrobe but cannot figure out exactly what it is?", "hi": "क्या आपको कभी लगता है कि आपकी अलमारी में कुछ कमी है, लेकिन आप ठीक-ठीक समझ नहीं पाते कि क्या?", "en_options": ["Never / Rarely", "Sometimes", "Often", "Very often"], "hi_options": ["कभी नहीं", "कभी-कभी", "अक्सर", "बहुत अक्सर"]}, {"en": "I want to maximize outfit options while minimizing the number of clothes in my wardrobe", "hi": "मैं अपनी अलमारी में कपड़ों की संख्या कम रखते हुए अधिक आउटफिट विकल्प चाहता/चाहती हूँ", "en_options": ["Not interested", "Slightly interested", "Interested", "Very interested"], "hi_options": ["रुचि नहीं है", "थोड़ी रुचि है", "रुचि है", "बहुत रुचि है"]}, {"en": "Do you need help deciding what to buy next?", "hi": "क्या अगली बार क्या खरीदना है, यह तय करने में आपको मदद चाहिए?", "en_options": ["Never / Rarely", "Sometimes", "Often", "Very often"], "hi_options": ["कभी नहीं", "कभी-कभी", "अक्सर", "बहुत अक्सर"]}, {"en": "How often do you shop for clothes?", "hi": "आप कपड़ों की खरीदारी कितनी बार करते हैं?", "en_options": ["Weekly", "Monthly", "Once every 2–3 months", "A few times a year", "Only when required"], "hi_options": ["हर सप्ताह", "हर महीने", "हर 2–3 महीने में एक बार", "साल में कुछ बार", "केवल आवश्यकता होने पर"]}, {"en": "Where do you usually shop for clothes?", "hi": "आप सामान्यतः कपड़ों की खरीदारी कहाँ से करते हैं?", "en_options": ["Local stores (Offline)", "Myntra", "AJIO", "Nykaa Fashion", "Tata CLiQ", "Other"], "hi_options": ["स्थानीय दुकानें (ऑफलाइन)", "Myntra", "AJIO", "Nykaa Fashion", "Tata CLiQ", "अन्य"], "type": "checkbox"}];

const state = {
  currentStep: 0,
  language: "en",
  answers: {},
  submissionPayload: null
};

const els = {
  closedView: document.getElementById("closedView"),
  introView: document.getElementById("introView"),
  surveyView: document.getElementById("surveyView"),
  thankYouView: document.getElementById("thankYouView"),
  errorView: document.getElementById("errorView"),
  closedTitle: document.getElementById("closedTitle"),
  closedMessage: document.getElementById("closedMessage"),
  introVideo: document.getElementById("introVideo"),
  videoPlaceholder: document.getElementById("videoPlaceholder"),
  videoStatus: document.getElementById("videoStatus"),
  continueWithoutVideo: document.getElementById("continueWithoutVideo"),
  videoProgress: document.getElementById("videoProgress"),
  skipIntro: document.getElementById("skipIntro"),
  stepContainer: document.getElementById("stepContainer"),
  stepLabel: document.getElementById("stepLabel"),
  progressCount: document.getElementById("progressCount"),
  progressPercent: document.getElementById("progressPercent"),
  surveyProgress: document.getElementById("surveyProgress"),
  backButton: document.getElementById("backButton"),
  nextButton: document.getElementById("nextButton"),
  retryButton: document.getElementById("retryButton")
};

function showView(view) {
  [els.closedView, els.introView, els.surveyView, els.thankYouView, els.errorView]
    .forEach(v => v.classList.add("hidden"));
  view.classList.remove("hidden");
}

function getSurveyAvailability() {
  const now = new Date();
  if (!CONFIG.surveyOpen) return { open:false, title:CONFIG.closedTitle, message:CONFIG.closedMessage };
  if (CONFIG.openingDate && now < new Date(CONFIG.openingDate))
    return { open:false, title:CONFIG.notStartedTitle, message:CONFIG.notStartedMessage };
  if (CONFIG.closingDate && now > new Date(CONFIG.closingDate))
    return { open:false, title:CONFIG.endedTitle, message:CONFIG.endedMessage };
  return { open:true };
}

function startApp() {
  const availability = getSurveyAvailability();
  if (!availability.open) {
    els.closedTitle.textContent = availability.title;
    els.closedMessage.textContent = availability.message;
    showView(els.closedView);
    return;
  }
  showView(els.introView);
  startIntro();
}

function startIntro() {
  const startedAt = Date.now();
  const durationMs = CONFIG.introDurationSeconds * 1000;
  let transitioned = false;
  let ready = false;

  function goToSurvey() {
    if (transitioned) return;
    transitioned = true;
    try { els.introVideo.pause(); } catch (_) {}
    showView(els.surveyView);
    renderStep();
  }

  function fallback() {
    if (ready || transitioned) return;
    els.videoStatus.textContent = "Video could not be loaded. You can continue with the survey.";
    els.continueWithoutVideo.classList.remove("hidden");
  }

  els.skipIntro.addEventListener("click", goToSurvey, { once:true });
  els.continueWithoutVideo.addEventListener("click", goToSurvey, { once:true });
  els.introVideo.addEventListener("ended", goToSurvey, { once:true });

  const readyHandler = () => {
    if (ready) return;
    ready = true;
    els.videoPlaceholder.classList.add("hidden");
    els.introVideo.play().catch(fallback);
  };

  els.introVideo.addEventListener("loadeddata", readyHandler, { once:true });
  els.introVideo.addEventListener("canplay", readyHandler, { once:true });
  els.introVideo.addEventListener("error", fallback, { once:true });
  els.introVideo.addEventListener("stalled", fallback);
  setTimeout(fallback, 3000);

  const timer = setInterval(() => {
    if (transitioned) {
      clearInterval(timer);
      return;
    }

    const elapsed = Date.now() - startedAt;
    const hasVideoTime = Number.isFinite(els.introVideo.duration) &&
      els.introVideo.duration > 0 && els.introVideo.currentTime > 0;

    const progress = hasVideoTime
      ? Math.min(100, els.introVideo.currentTime / els.introVideo.duration * 100)
      : Math.min(100, elapsed / durationMs * 100);

    els.videoProgress.style.width = `${progress}%`;

    if (elapsed >= durationMs + 500) goToSurvey();
  }, 100);
}

function renderStep() {
  const total = QUESTIONS.length + 1;
  const stepNumber = state.currentStep + 1;
  const percent = Math.round(stepNumber / total * 100);
  const hi = state.language === "hi";

  document.documentElement.lang = state.language;
  els.stepLabel.textContent = state.currentStep === 0
    ? (hi ? "आपके बारे में" : "About you")
    : `${hi ? "प्रश्न" : "Question"} ${state.currentStep}`;

  els.progressCount.textContent = `${stepNumber} / ${total}`;
  els.progressPercent.textContent = `${percent}%`;
  els.surveyProgress.style.width = `${percent}%`;
  els.backButton.disabled = state.currentStep === 0;
  els.backButton.textContent = hi ? "पीछे" : "Back";
  els.nextButton.textContent = state.currentStep === QUESTIONS.length
    ? (hi ? "जमा करें" : "Submit")
    : (hi ? "आगे" : "Continue");

  if (state.currentStep === 0) renderAboutStep();
  else renderQuestionStep(QUESTIONS[state.currentStep - 1]);
}

function renderAboutStep() {
  const hi = state.language === "hi";

  els.stepContainer.innerHTML = `
    <div class="step-card">
      <p class="eyebrow">${hi ? "प्रथम भाग" : "Section one"}</p>
      <h2>${hi ? "आपके बारे में थोड़ा सा" : "A little about you"}</h2>
      <p class="step-description">${hi ? "अपनी पसंदीदा भाषा चुनें और सामान्य जानकारी भरें।" : "Choose your preferred language and complete the basic details."}</p>

      <div class="field">
        <label>${hi ? "सर्वे की भाषा" : "Survey language"}</label>
        <div class="language-choice">
          <label class="language-card">
            <input type="radio" name="language" value="en" ${state.language === "en" ? "checked" : ""}>
            <span>English</span>
          </label>
          <label class="language-card">
            <input type="radio" name="language" value="hi" ${state.language === "hi" ? "checked" : ""}>
            <span>हिन्दी</span>
          </label>
        </div>
      </div>

      <div class="about-grid">
        <div class="field">
          <label for="age">${hi ? "आयु वर्ग" : "Age group"}</label>
          <select id="age">${buildSelectOptions(
            hi ? ["18 वर्ष से कम","18–24","25–34","35–44","45–54","55 वर्ष या अधिक","बताना नहीं चाहते"]
               : ["Under 18","18–24","25–34","35–44","45–54","55 or above","Prefer not to say"],
            state.answers.age
          )}</select>
        </div>

        <div class="field">
          <label for="identity">${hi ? "आपकी लैंगिक पहचान क्या है?" : "What is your gender identity?"}</label>
          <select id="identity">${buildSelectOptions(
            hi ? ["महिला","पुरुष","अन्य"] : ["Female","Male","Other"],
            state.answers.identity
          )}</select>
        </div>

        <div class="field full">
          <label for="occupation">${hi ? "वर्तमान व्यवसाय" : "Current occupation"}</label>
          <select id="occupation">${buildSelectOptions(
            hi ? ["विद्यार्थी","वेतनभोगी पेशेवर","व्यवसायी या स्वरोज़गार","गृहिणी / गृहस्थ","फ्रीलांसर","अन्य","बताना नहीं चाहते"]
               : ["Student","Salaried professional","Business owner or self-employed","Homemaker","Freelancer","Other","Prefer not to say"],
            state.answers.occupation
          )}</select>
        </div>
      </div>
    </div>`;

  document.querySelectorAll('input[name="language"]').forEach(input => {
    input.addEventListener("change", e => {
      state.language = e.target.value;
      state.answers.age = "";
      state.answers.identity = "";
      state.answers.occupation = "";
      renderStep();
    });
  });
}

function buildSelectOptions(options, selected) {
  const placeholder = state.language === "hi" ? "चुनें" : "Select";
  return `<option value="">${placeholder}</option>` +
    options.map(option =>
      `<option value="${escapeHtml(option)}" ${selected === option ? "selected" : ""}>${escapeHtml(option)}</option>`
    ).join("");
}

function renderQuestionStep(question) {
  const answerKey = `q${state.currentStep}`;
  const inputType = question.type === "checkbox" ? "checkbox" : "radio";
  const saved = state.answers[answerKey] || (inputType === "checkbox" ? [] : "");
  const title = state.language === "hi" ? question.hi : question.en;
  const options = state.language === "hi" ? question.hi_options : question.en_options;
  const label = state.language === "hi" ? "प्रश्न" : "Question";

  els.stepContainer.innerHTML = `
    <div class="step-card">
      <p class="eyebrow">${label} ${state.currentStep}</p>
      <h2>${escapeHtml(title)}</h2>
      <div class="options">
        ${options.map(option => {
          const checked = inputType === "checkbox" ? saved.includes(option) : saved === option;
          return `
            <label class="option">
              <input type="${inputType}" name="${answerKey}" value="${escapeHtml(option)}" ${checked ? "checked" : ""}>
              <span>${escapeHtml(option)}</span>
            </label>`;
        }).join("")}
      </div>
    </div>`;
}

function saveCurrentStep() {
  const hi = state.language === "hi";

  if (state.currentStep === 0) {
    const age = document.getElementById("age").value;
    const identity = document.getElementById("identity").value;
    const occupation = document.getElementById("occupation").value;

    if (!age || !identity || !occupation) {
      alert(hi ? "कृपया सभी जानकारी भरें।" : "Please complete all three fields.");
      return false;
    }

    state.answers.age = age;
    state.answers.identity = identity;
    state.answers.occupation = occupation;
    return true;
  }

  const question = QUESTIONS[state.currentStep - 1];
  const answerKey = `q${state.currentStep}`;

  if (question.type === "checkbox") {
    const selected = [...document.querySelectorAll(`input[name="${answerKey}"]:checked`)]
      .map(input => input.value);

    if (!selected.length) {
      alert(hi ? "कृपया कम से कम एक विकल्प चुनें।" : "Please select at least one option.");
      return false;
    }

    state.answers[answerKey] = selected;
    return true;
  }

  const selected = document.querySelector(`input[name="${answerKey}"]:checked`);
  if (!selected) {
    alert(hi ? "कृपया एक विकल्प चुनें।" : "Please select an option.");
    return false;
  }

  state.answers[answerKey] = selected.value;
  return true;
}

function goNext() {
  if (!saveCurrentStep()) return;

  if (state.currentStep < QUESTIONS.length) {
    state.currentStep += 1;
    renderStep();
    window.scrollTo({ top:0, behavior:"smooth" });
    return;
  }

  submitSurvey();
}

function goBack() {
  if (state.currentStep === 0) return;
  state.currentStep -= 1;
  renderStep();
  window.scrollTo({ top:0, behavior:"smooth" });
}

function buildSubmissionPayload() {
  return {
    submittedAt: new Date().toISOString(),
    surveyVersion: "2.0-bilingual",
    language: state.language === "hi" ? "Hindi" : "English",
    age: state.answers.age,
    identity: state.answers.identity,
    occupation: state.answers.occupation,
    responses: QUESTIONS.map((question, index) => ({
      questionNumber: index + 1,
      question: question.en,
      displayedQuestion: state.language === "hi" ? question.hi : question.en,
      answer: state.answers[`q${index + 1}`]
    }))
  };
}

async function submitSurvey() {
  const hi = state.language === "hi";
  els.nextButton.disabled = true;
  els.nextButton.textContent = hi ? "जमा हो रहा है..." : "Submitting...";

  const payload = buildSubmissionPayload();
  state.submissionPayload = payload;

  if (!CONFIG.apiUrl || CONFIG.apiUrl.includes("PASTE_YOUR")) {
    localStorage.setItem("wardrobeSurveyDemoResponse", JSON.stringify(payload));
    showView(els.thankYouView);
    return;
  }

  try {
    const response = await fetch(CONFIG.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Request failed");
    const result = await response.json();
    if (!result.success) throw new Error(result.message || "Submission failed");
    showView(els.thankYouView);
  } catch (error) {
    console.error(error);
    showView(els.errorView);
  } finally {
    els.nextButton.disabled = false;
    els.nextButton.textContent = hi ? "जमा करें" : "Submit";
  }
}

function retrySubmission() {
  showView(els.surveyView);
  submitSurvey();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

els.nextButton.addEventListener("click", goNext);
els.backButton.addEventListener("click", goBack);
els.retryButton.addEventListener("click", retrySubmission);

startApp();
