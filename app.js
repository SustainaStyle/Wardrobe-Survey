const CONFIG = window.SURVEY_CONFIG;

const QUESTIONS = [
  {
    type: "about",
    title: "A little about you",
    description: "These details help us understand how wardrobe habits vary across different groups."
  },
  {
    title: "I have nothing to Wear, How often you feel?",
    options: ["Rarely", "Sometimes", "Often", "Almost every day"]
  },
  {
    title: "I want to improve my style when I go out?",
    options: ["Rarely", "Sometimes", "Often", "Almost every day"]
  },
  {
    title: "Do you ever feel your wardrobe is missing something but can't figure out what?",
    options: ["Rarely", "Sometimes", "Often", "Almost every day"]
  },
  {
    title: "How often do you plan outfits in advance for specific occasions or events?",
    options: ["Never",  "Sometimes", "Often", "Always"]
  },
  {
    title: "Do you have clothes in your wardrobe that you have never worn or rarely wear?",
    options: ["Yes, many", "Yes, a few", "Very few", "No"]
  },
  {
    title: "How many clothes in your wardrobe do you feel no longer suit your style?",
    options: ["Many", "Some", "Very few", "None"]
  },
  {
    title: "Do you ever feel that something is missing from your wardrobe but cannot figure out exactly what it is?",
    options: ["Rarely", "Sometimes", "Often", "Very often"]
  },
  {
    title: "I want to maximize outfit options while minimizing the number of clothes in my wardrobe",
    options: ["Not interested", "Slightly interested", "Interested", "Very interested"]
  },
  {
    title: "Do you need help deciding what to buy next?",
    options: ["Rarely", "Sometimes", "Often", "Very often"]
  },
  {
    title: "How often do you shop for clothes?",
    options: ["Weekly", "Monthly", "Once every 2–3 months", "A few times a year", "Only when required"]
  },
  {
    title: "Where do you usually shop for clothes?",
    type: "checkbox",
    options: [ "Local stores (Off-line)", "Myntra", "AJIO", "Nykaa Fashion", "Tata CLiQ", "Other"]
  }
];

const state = {
  currentStep: 0,
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

  if (!CONFIG.surveyOpen) {
    return {
      open: false,
      title: CONFIG.closedTitle,
      message: CONFIG.closedMessage
    };
  }

  if (CONFIG.openingDate) {
    const opening = new Date(CONFIG.openingDate);
    if (now < opening) {
      return {
        open: false,
        title: CONFIG.notStartedTitle,
        message: CONFIG.notStartedMessage
      };
    }
  }

  if (CONFIG.closingDate) {
    const closing = new Date(CONFIG.closingDate);
    if (now > closing) {
      return {
        open: false,
        title: CONFIG.endedTitle,
        message: CONFIG.endedMessage
      };
    }
  }

  return { open: true };
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
  let fallbackStart = Date.now();
  let transitioned = false;
  const durationMs = CONFIG.introDurationSeconds * 1000;

  function goToSurvey() {
    if (transitioned) return;
    transitioned = true;
    try { els.introVideo.pause(); } catch (_) {}
    showView(els.surveyView);
    renderStep();
  }

  els.skipIntro.addEventListener("click", goToSurvey, { once: true });
  els.introVideo.addEventListener("ended", goToSurvey, { once: true });

  els.introVideo.addEventListener("loadeddata", () => {
    els.videoPlaceholder.classList.add("hidden");
    els.introVideo.play().catch(() => {});
  }, { once: true });

  els.introVideo.addEventListener("error", () => {
    els.videoPlaceholder.classList.remove("hidden");
  }, { once: true });

  const timer = setInterval(() => {
    if (transitioned) {
      clearInterval(timer);
      return;
    }

    let progress;
    if (els.introVideo.duration && Number.isFinite(els.introVideo.duration) && els.introVideo.currentTime > 0) {
      progress = Math.min(100, (els.introVideo.currentTime / els.introVideo.duration) * 100);
    } else {
      progress = Math.min(100, ((Date.now() - fallbackStart) / durationMs) * 100);
    }

    els.videoProgress.style.width = `${progress}%`;

    if (Date.now() - fallbackStart >= durationMs + 500) {
      goToSurvey();
    }
  }, 100);
}

function renderStep() {
  const step = QUESTIONS[state.currentStep];
  const total = QUESTIONS.length;
  const stepNumber = state.currentStep + 1;
  const percent = Math.round((stepNumber / total) * 100);

  els.stepLabel.textContent = state.currentStep === 0 ? "About you" : `Question ${state.currentStep}`;
  els.progressCount.textContent = `${stepNumber} of ${total}`;
  els.progressPercent.textContent = `${percent}%`;
  els.surveyProgress.style.width = `${percent}%`;
  els.backButton.disabled = state.currentStep === 0;
  els.nextButton.textContent = state.currentStep === total - 1 ? "Submit" : "Continue";

  if (step.type === "about") {
    renderAboutStep(step);
  } else {
    renderQuestionStep(step);
  }
}

function renderAboutStep(step) {
  els.stepContainer.innerHTML = `
    <div class="step-card">
      <p class="eyebrow">Section one</p>
      <h2>${step.title}</h2>
      <p class="step-description">${step.description}</p>

      <div class="about-grid">
        <div class="field">
          <label for="age">Age group</label>
          <select id="age">
            ${buildSelectOptions([
              "Under 18", "18–24", "25–34", "35–44",
              "45–54", "55 or above", "Prefer not to say"
            ], state.answers.age)}
          </select>
        </div>

        <div class="field">
          <label for="identity">What is your gender identity?</label>
          <select id="identity">
            ${buildSelectOptions([
              "Female", "Male", "Other"
            ], state.answers.identity)}
          </select>
        </div>

        <div class="field full">
          <label for="occupation">Current occupation</label>
          <select id="occupation">
            ${buildSelectOptions([
              "Student", "Salaried professional",
              "Business owner or self-employed", "Homemaker",
              "Freelancer", "Other", "Prefer not to say"
            ], state.answers.occupation)}
          </select>
        </div>
      </div>
    </div>
  `;
}

function buildSelectOptions(options, selected) {
  return `<option value="">Select</option>` +
    options.map(option =>
      `<option value="${escapeHtml(option)}" ${selected === option ? "selected" : ""}>${escapeHtml(option)}</option>`
    ).join("");
}

function renderQuestionStep(step) {
  const answerKey = `q${state.currentStep}`;
  const saved = state.answers[answerKey] || (step.type === "checkbox" ? [] : "");
  const inputType = step.type === "checkbox" ? "checkbox" : "radio";

  els.stepContainer.innerHTML = `
    <div class="step-card">
      <p class="eyebrow">Question ${state.currentStep}</p>
      <h2>${escapeHtml(step.title)}</h2>
      <div class="options">
        ${step.options.map(option => {
          const checked = inputType === "checkbox"
            ? saved.includes(option)
            : saved === option;

          return `
            <label class="option">
              <input
                type="${inputType}"
                name="${answerKey}"
                value="${escapeHtml(option)}"
                ${checked ? "checked" : ""}
              />
              <span>${escapeHtml(option)}</span>
            </label>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function saveCurrentStep() {
  const step = QUESTIONS[state.currentStep];

  if (step.type === "about") {
    const age = document.getElementById("age").value;
    const identity = document.getElementById("identity").value;
    const occupation = document.getElementById("occupation").value;

    if (!age || !identity || !occupation) {
      alert("Please complete all three fields.");
      return false;
    }

    state.answers.age = age;
    state.answers.identity = identity;
    state.answers.occupation = occupation;
    return true;
  }

  const answerKey = `q${state.currentStep}`;

  if (step.type === "checkbox") {
    const selected = [...document.querySelectorAll(`input[name="${answerKey}"]:checked`)]
      .map(input => input.value);

    if (!selected.length) {
      alert("Please select at least one option.");
      return false;
    }

    state.answers[answerKey] = selected;
    return true;
  }

  const selected = document.querySelector(`input[name="${answerKey}"]:checked`);

  if (!selected) {
    alert("Please select an option.");
    return false;
  }

  state.answers[answerKey] = selected.value;
  return true;
}

function goNext() {
  if (!saveCurrentStep()) return;

  if (state.currentStep < QUESTIONS.length - 1) {
    state.currentStep += 1;
    renderStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  submitSurvey();
}

function goBack() {
  if (state.currentStep === 0) return;
  state.currentStep -= 1;
  renderStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function buildSubmissionPayload() {
  return {
    submittedAt: new Date().toISOString(),
    surveyVersion: "1.0",
    age: state.answers.age,
    identity: state.answers.identity,
    occupation: state.answers.occupation,
    responses: QUESTIONS.slice(1).map((question, index) => ({
      questionNumber: index + 1,
      question: question.title,
      answer: state.answers[`q${index + 1}`]
    }))
  };
}

async function submitSurvey() {
  els.nextButton.disabled = true;
  els.nextButton.textContent = "Submitting...";

  const payload = buildSubmissionPayload();
  state.submissionPayload = payload;

  if (!CONFIG.apiUrl || CONFIG.apiUrl.includes("PASTE_YOUR")) {
    console.warn("No API URL configured. Response shown in console only.", payload);
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
    els.nextButton.textContent = "Submit";
  }
}

function retrySubmission() {
  showView(els.surveyView);
  submitSurvey();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

els.nextButton.addEventListener("click", goNext);
els.backButton.addEventListener("click", goBack);
els.retryButton.addEventListener("click", retrySubmission);

startApp();
