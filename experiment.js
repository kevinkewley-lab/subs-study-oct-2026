// ==========================================
// 0. Initialize jsPsych & Participant Data
// ==========================================
const jsPsych = initJsPsych({
  on_finish: function () {
    // Optional fallback: downloads data locally if pipeline fails
    // jsPsych.data.get().localSave('csv', filename);
  }
});

// Identify participant and condition
const conditionTag = window.EXPERIMENT_CONDITION || 'default';
const videoSrc = window.VIDEO_SOURCE || 'media/main_video.mp4';
const subject_id = jsPsych.randomization.randomID(10);
const filename = `${conditionTag}_${subject_id}.csv`;

// Ensure every single trial row in the CSV records the participant ID and condition
jsPsych.data.addProperties({
  subject: subject_id,
  condition: conditionTag
});

const timeline = [];

// ==========================================
// 1. Audio Items Configuration (16 Stimuli)
// ==========================================
const audio_items = [
  // Real Words (1–8)
  { audio: 'media/excerpt_1_capsule.mp3',  item_id: 1,  target_word: 'capsule',  word_type: 'real',        in_video: true },
  { audio: 'media/excerpt_2_plans.mp3',    item_id: 2,  target_word: 'plans',    word_type: 'real',        in_video: true },
  { audio: 'media/excerpt_3_engineer.mp3', item_id: 3,  target_word: 'engineer', word_type: 'real',        in_video: true },
  { audio: 'media/excerpt_4_space.mp3',    item_id: 4,  target_word: 'space',    word_type: 'real',        in_video: true },
  { audio: 'media/excerpt_5_base.mp3',     item_id: 5,  target_word: 'base',     word_type: 'real',        in_video: false },
  { audio: 'media/excerpt_6_star.mp3',     item_id: 6,  target_word: 'star',     word_type: 'real',        in_video: false },
  { audio: 'media/excerpt_7_office.mp3',   item_id: 7,  target_word: 'office',   word_type: 'real',        in_video: false },
  { audio: 'media/excerpt_8_screen.mp3',   item_id: 8,  target_word: 'screen',   word_type: 'real',        in_video: false },

  // Pseudowords (9–16)
  { audio: 'media/excerpt_9_vord.mp3',     item_id: 9,  target_word: 'vord',     word_type: 'pseudoword',  in_video: true },
  { audio: 'media/excerpt_10_ozrek.mp3',   item_id: 10, target_word: 'ozrek',    word_type: 'pseudoword',  in_video: true },
  { audio: 'media/excerpt_11_florns.mp3',  item_id: 11, target_word: 'florns',   word_type: 'pseudoword',  in_video: true },
  { audio: 'media/excerpt_12_nemvo.mp3',   item_id: 12, target_word: 'nemvo',    word_type: 'pseudoword',  in_video: true },
  { audio: 'media/excerpt_13_onk.mp3',     item_id: 13, target_word: 'onk',      word_type: 'pseudoword',  in_video: false },
  { audio: 'media/excerpt_14_nuggy.mp3',   item_id: 14, target_word: 'nuggy',    word_type: 'pseudoword',  in_video: false },
  { audio: 'media/excerpt_15_vulling.mp3', item_id: 15, target_word: 'vulling',  word_type: 'pseudoword',  in_video: false },
  { audio: 'media/excerpt_16_frask.mp3',   item_id: 16, target_word: 'frask',    word_type: 'pseudoword',  in_video: false }
];

// Preload stimuli
const preload = {
  type: jsPsychPreload,
  video: [videoSrc],
  audio: audio_items.map(item => item.audio),
  message: '<p style="font-family: sans-serif;">Loading multimedia resources... Please wait.</p>',
  error_message: '<p style="font-family: sans-serif; color: red;">Failed to load resources. Please refresh the page and check your connection.</p>'
};
timeline.push(preload);

// ==========================================
// 2. Academic Information & Informed Consent Form
// ==========================================
const participant_info = {
  type: jsPsychSurveyHtmlForm,
  html: `
    <div style="text-align: left; max-width: 640px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 0.95rem; line-height: 1.6; color: #2d3748;">
      
      <!-- Academic Header & Details Box -->
      <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #1a202c; margin: 0 0 12px 0; text-align: center; line-height: 1.4;">
          The Influence of Subtitles on Novel Word Recall and Recognition in L2 English
        </h2>
        <p style="font-size: 0.88rem; color: #4a5568; margin: 0 0 16px 0; text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
          <strong>Principal Investigator:</strong> Kevin Kewley<br>
          <span style="color: #718096;">Department of Speech Communication / English, Shih Hsin University</span>
        </p>

        <!-- Purpose -->
        <div style="margin-bottom: 14px;">
          <strong style="color: #2b6cb0;">Purpose of the Study / 研究目的：</strong>
          <p style="margin: 4px 0 0 0;">This study investigates how second language learners comprehend and process English multimedia content.</p>
          <p style="margin: 2px 0 0 0; color: #4a5568;">本研究旨在探討第二語言學習者如何理解和處理英語多媒體內容。</p>
        </div>

        <!-- What You Will Do -->
        <div style="margin-bottom: 14px;">
          <strong style="color: #2b6cb0;">What You Will Do / 您將參與的活動：</strong>
          <p style="margin: 4px 0 0 0;">You will watch a short English video clip and answer follow-up questions related to the video and language comprehension. The total session takes approximately 10–15 minutes.</p>
          <p style="margin: 2px 0 0 0; color: #4a5568;">您將觀看一段英語短視頻，並回答與視頻內容及語言理解相關的問題。整個過程大約需要 10 到 15 分鐘。</p>
        </div>

        <!-- Voluntary Participation & Anonymity -->
        <div>
          <strong style="color: #2b6cb0;">Voluntary Participation & Anonymity / 自願參與與匿名性：</strong>
          <p style="margin: 4px 0 0 0;">Your participation is entirely voluntary. You may discontinue the session at any point without penalty or any impact on your academic standing or course grades. All collected responses are strictly confidential, anonymized via participant ID numbers, and reported only in aggregate academic summaries.</p>
          <p style="margin: 2px 0 0 0; color: #4a5568;">您的參與完全出於自願。您可以隨時終止參與，且不會因此受到任何懲罰，也不會影響您的學籍狀況或課程成績。所有收集到的回應均嚴格保密，透過參與者編號進行匿名化處理，並僅以匯總後的學術摘要形式進行報告。</p>
        </div>
      </div>

      <!-- Informed Consent Radio -->
      <div style="margin-bottom: 24px; padding: 16px; background: #fffaf0; border: 1px solid #feebc8; border-radius: 6px;">
        <p style="font-weight: bold; margin: 0 0 10px 0; color: #7b341e;">
          Do you agree to take part in this study? / 您是否同意參與本研究？
        </p>
        <label style="display: block; margin-bottom: 10px; cursor: pointer;">
          <input type="radio" name="consent" value="agreed" required style="margin-right: 8px;">
          <span><strong>I am at least 18 years old, understand the terms, and agree to participate.</strong><br>
          <span style="color: #555; font-size: 0.9rem;">我已年滿18歲，了解相關條款，並同意參與。</span></span>
        </label>
        <label style="display: block; cursor: pointer;">
          <input type="radio" name="consent" value="declined" required style="margin-right: 8px;">
          <span><strong>I do not wish to participate.</strong><br>
          <span style="color: #555; font-size: 0.9rem;">我不願參與。</span></span>
        </label>
      </div>

      <!-- Participant Demographic Details -->
      <h3 style="font-size: 1.05rem; border-bottom: 2px solid #edf2f7; padding-bottom: 6px; margin: 0 0 18px 0; color: #2d3748;">
        Participant Details / 受試者資料
      </h3>

      <!-- Participant ID -->
      <div style="margin-bottom: 18px;">
        <label for="p_id" style="font-weight: bold; display: block; margin-bottom: 4px;">
          Participant ID / 代號:
        </label>
        <input 
          type="text" 
          id="p_id" 
          name="participant_id" 
          required 
          autocomplete="off"
          placeholder="e.g., A115123456"
          style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e0; border-radius: 4px; box-sizing: border-box;"
        />
      </div>

      <!-- Age -->
      <div style="margin-bottom: 18px;">
        <label for="age" style="font-weight: bold; display: block; margin-bottom: 4px;">
          Age / 年齡:
        </label>
        <input 
          type="number" 
          id="age" 
          name="age" 
          min="18" 
          max="120" 
          required 
          placeholder="e.g., 20"
          style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e0; border-radius: 4px; box-sizing: border-box;"
        />
      </div>

      <!-- Sex -->
      <div style="margin-bottom: 18px;">
        <p style="font-weight: bold; margin: 0 0 6px 0;">Sex / 性別:</p>
        <label style="display: inline-block; margin-right: 24px; cursor: pointer;">
          <input type="radio" name="sex" value="Male" required style="margin-right: 4px;"> Male 男
        </label>
        <label style="display: inline-block; cursor: pointer;">
          <input type="radio" name="sex" value="Female" required style="margin-right: 4px;"> Female 女
        </label>
      </div>

      <!-- Native Language -->
      <div style="margin-bottom: 24px;">
        <p style="font-weight: bold; margin: 0 0 6px 0;">Native Language / 母語:</p>
        
        <label style="display: block; margin-bottom: 8px; cursor: pointer;">
          <input 
            type="radio" 
            name="native_language" 
            value="Mandarin" 
            required 
            onclick="document.getElementById('other_lang_input').required = false; document.getElementById('other_lang_box').style.display = 'none';"
            style="margin-right: 6px;"
          > Mandarin 中文
        </label>

        <label style="display: block; margin-bottom: 8px; cursor: pointer;">
          <input 
            type="radio" 
            name="native_language" 
            value="English" 
            required 
            onclick="document.getElementById('other_lang_input').required = false; document.getElementById('other_lang_box').style.display = 'none';"
            style="margin-right: 6px;"
          > English 英文
        </label>

        <label style="display: block; margin-bottom: 8px; cursor: pointer;">
          <input 
            type="radio" 
            name="native_language" 
            value="Other" 
            required 
            onclick="document.getElementById('other_lang_input').required = true; document.getElementById('other_lang_box').style.display = 'block';"
            style="margin-right: 6px;"
          > Other (please specify) 其他（請註明）
        </label>

        <div id="other_lang_box" style="display: none; margin-left: 24px; margin-top: 8px;">
          <input 
            type="text" 
            id="other_lang_input" 
            name="other_language_specified" 
            placeholder="Please specify / 請填寫母語"
            style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e0; border-radius: 4px; box-sizing: border-box;"
          />
        </div>
      </div>

    </div>
  `,
  button_label: 'Begin / 開始',
  on_finish: function (data) {
    const responses = data.response;

    // Handle withdrawal / declined consent immediately
    if (responses.consent === 'declined') {
      jsPsych.endExperiment(`
        <div style="max-width: 600px; margin: 40px auto; font-family: sans-serif; line-height: 1.6; text-align: center;">
          <h3>Study Exited / 已終止參與</h3>
          <p>You have chosen not to participate in this study. No data has been recorded.</p>
          <p>您已選擇不參與本研究，系統未記錄任何資料。您可以直接關閉此視窗。</p>
        </div>
      `);
      return;
    }

    const finalLanguage = responses.native_language === 'Other' && responses.other_language_specified
      ? responses.other_language_specified.trim()
      : responses.native_language;

    // Append metadata to every subsequent trial row in the DataPipe CSV
    jsPsych.data.addProperties({
      consent_given: responses.consent === 'agreed',
      participant_id: responses.participant_id,
      age: responses.age,
      sex: responses.sex,
      native_language: finalLanguage
    });
  }
};
timeline.push(participant_info);
// ==========================================
// 3. Instructions Screen
// ==========================================
const instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="max-width: 700px; margin: 0 auto; line-height: 1.6; text-align: left; font-family: sans-serif;">
      <h2 style="text-align: center;">Instructions / 實驗說明</h2>
      <p>1. You will watch a short video. Please pay close attention to both visual content and spoken dialogue.</p>
      <p>2. Following the video, you will listen to <strong>16 short audio excerpts</strong>.</p>
      <p>3. For each excerpt, you may listen up to <strong>2 times maximum</strong> and answer two questions regarding the key word.</p>
      <p>Please make sure your audio is enabled and clear.</p>
    </div>
  `,
  choices: ['Start Video / 開始觀看影片']
};
timeline.push(instructions);

// ==========================================
// 4. Video Presentation (Enforced Full Watch)
// ==========================================
const video_trial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return `
      <div style="max-width: 760px; margin: 0 auto; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <!-- controlslist="nodownload noplaybackrate" prevents downloading or speed changing -->
        <video 
          id="stimulus-video" 
          width="100%" 
          controls 
          playsinline 
          preload="auto"
          controlslist="nodownload noplaybackrate"
          style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
        >
          <source src="${videoSrc}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <p id="video-instruction" style="margin-top: 14px; font-size: 0.95rem; color: #4a5568; font-weight: 500;">
          ▶ Please click play to watch the entire video. The proceed button will appear once the video finishes.<br>
          <span style="font-size: 0.85rem; color: #718096;">請點擊播放並完整觀看影片。影片播放完畢後方可進行下一步。</span>
        </p>
      </div>
    `;
  },
  choices: ['Video Finished - Proceed / 影片結束，下一步'],
  on_load: function() {
    const video = document.getElementById('stimulus-video');
    const button = document.querySelector('.jspsych-btn');
    const instruction = document.getElementById('video-instruction');

    // 1. Hide the proceed button immediately on load
    if (button) {
      button.style.display = 'none';
    }

    // 2. Prevent skipping/scrubbing forward
    let maxTimeReached = 0;
    video.addEventListener('timeupdate', function() {
      if (!video.seeking) {
        if (video.currentTime > maxTimeReached) {
          maxTimeReached = video.currentTime;
        }
      }
    });

    video.addEventListener('seeking', function() {
      // If user tries to scrub past what they have actually watched, snap them back
      if (video.currentTime > maxTimeReached) {
        video.currentTime = maxTimeReached;
      }
    });

    // 3. Reveal and activate button only when video ends
    video.addEventListener('ended', function() {
      if (button) {
        button.style.display = 'inline-block';
        button.scrollIntoView({ behavior: 'smooth' });
      }
      if (instruction) {
        instruction.innerHTML = `
          <span style="color: #2b6cb0; font-weight: bold;">
            ✓ Video completed. Click below to continue. / 影片已播放完畢，請點擊下方按鈕繼續。
          </span>
        `;
      }
    });
  },
  data: { phase: 'video_presentation', video_source: videoSrc }
};
timeline.push(video_trial);

// ==========================================
// 5. Audio Player + 6-Point Confidence Rating + Translation
// ==========================================
const audio_combined_trial = {
  type: jsPsychSurveyHtmlForm,
  html: function() {
    const audioSrc = jsPsych.evaluateTimelineVariable('audio');

    return `
      <div style="text-align: left; max-width: 680px; margin: 0 auto; font-family: sans-serif; font-size: 1rem; line-height: 1.6;">
        
        <!-- Hidden input tracking play count -->
        <input type="hidden" id="audio_play_count" name="audio_play_count" value="0">

        <!-- Audio Player Container with 2-Play Enforcement -->
        <div style="text-align: center; margin-bottom: 25px; padding: 16px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">🎧 Audio Excerpt / 音檔播放</p>
          <audio 
            id="audio_player" 
            controls 
            controlslist="nodownload" 
            preload="auto" 
            style="width: 100%; max-width: 420px;"
            onplay="
              var countInput = document.getElementById('audio_play_count');
              var currentCount = parseInt(countInput.value, 10) + 1;
              countInput.value = currentCount;
              var notice = document.getElementById('play_notice');
              if (currentCount >= 2) {
                this.removeAttribute('controls');
                notice.innerHTML = '<span style=\\'color: #d9534f; font-weight: bold;\\'>Replay limit reached (2/2) / 已達播放上限（2次）</span>';
              } else {
                notice.innerText = 'Plays remaining: ' + (2 - currentCount) + ' / 剩餘播放次數：' + (2 - currentCount);
              }
            "
          >
            <source src="${audioSrc}" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
          <p id="play_notice" style="margin: 8px 0 0 0; font-size: 0.85rem; color: #666;">
            Maximum 2 plays allowed / 最多可播放 2 次
          </p>
        </div>

        <!-- Question 1: 6-Point Confidence Scale -->
        <div style="margin-bottom: 24px;">
          <p style="font-weight: bold; margin-bottom: 6px;">
            [Stage 1: Form Recognition] “Did you hear this word in the video?"<br>
            <span style="font-weight: normal; color: #333;">你在影片裡聽到這個詞了嗎？</span>
          </p>
          <p style="font-size: 0.85rem; color: #666; margin: 0 0 12px 0;">(6-point scale: Definitely No ── Definitely Yes / 肯定不在 ── 肯定在)</p>
          
          <div style="display: flex; flex-direction: column; gap: 8px; margin-left: 4px;">
            <label style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <input type="radio" name="recognition_scale" value="1" required>
              <span><strong>1</strong> = Definitely Not in Video 肯定不在影片中</span>
            </label>
            <label style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <input type="radio" name="recognition_scale" value="2" required>
              <span><strong>2</strong> = Probably Not in Video 可能不在影片中</span>
            </label>
            <label style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <input type="radio" name="recognition_scale" value="3" required>
              <span><strong>3</strong> = Guessing Not in Video 猜測不在影片中</span>
            </label>
            <label style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <input type="radio" name="recognition_scale" value="4" required>
              <span><strong>4</strong> = Guessing in Video 猜測在影片中</span>
            </label>
            <label style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <input type="radio" name="recognition_scale" value="5" required>
              <span><strong>5</strong> = Probably in Video 可能在影片中</span>
            </label>
            <label style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <input type="radio" name="recognition_scale" value="6" required>
              <span><strong>6</strong> = Definitely in Video 肯定在影片中</span>
            </label>
          </div>
        </div>

        <hr style="border: 0; border-top: 1px solid #ddd; margin: 24px 0;">

        <!-- Question 2: Translation Short Answer -->
        <div style="margin-bottom: 24px;">
          <p style="font-weight: bold; margin-bottom: 8px;">
            Write the Mandarin translation of the key word.<br>
            <span style="font-weight: normal; color: #444;">寫出關鍵字的國語翻譯：</span>
          </p>
          <input 
            type="text" 
            name="mandarin_translation" 
            required 
            autocomplete="off"
            onkeydown="if(event.key === 'Enter'){ event.preventDefault(); }"
            style="width: 100%; padding: 10px; font-size: 1rem; border: 1px solid #aaa; border-radius: 4px; box-sizing: border-box;"
            placeholder="請在此輸入中文翻譯..."
          />
        </div>

      </div>
    `;
  },
  button_label: 'Submit / 送出',
  data: {
    phase: 'audio_comprehension',
    item_id: jsPsych.timelineVariable('item_id'),
    audio_file: jsPsych.timelineVariable('audio'),
    target_word: jsPsych.timelineVariable('target_word'),
    word_type: jsPsych.timelineVariable('word_type'),
    appeared_in_video: jsPsych.timelineVariable('in_video')
  },
  on_finish: function(data) {
    data.recognition_rating = parseInt(data.response.recognition_scale, 10);
    data.mandarin_translation = data.response.mandarin_translation;
    data.audio_play_count = parseInt(data.response.audio_play_count, 10);
    data.time_spent_seconds = (data.rt / 1000).toFixed(2);
  }
};

// Procedure with randomized item presentation
const audio_procedure = {
  timeline: [audio_combined_trial],
  timeline_variables: audio_items,
  randomize_order: true
};
timeline.push(audio_procedure);

// ==========================================
// 6. Direct DataPipe Transmission & Debrief
// ==========================================
const save_and_debrief = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif; line-height: 1.6; text-align: center;">
        <h2>Submitting Data / 資料傳送中...</h2>
        <p id="upload-status" style="color: #555;">Please wait while your responses are being saved.</p>
      </div>
    `;
  },
  choices: ['Finish / 結束'],
  on_load: function() {
    // Hide the finish button until the data upload finishes
    const finishBtn = document.querySelector('.jspsych-btn');
    if (finishBtn) finishBtn.style.display = 'none';

    const csvData = jsPsych.data.get().csv();

    // Direct HTTP POST to DataPipe API
    fetch("https://pipe.jspsych.org/api/data/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
      },
      body: JSON.stringify({
        experimentID: "Dkh9QFetwDLM",
        filename: filename,
        data: csvData
      })
    })
    .then(response => {
      const statusEl = document.getElementById('upload-status');
      if (response.ok) {
        if (statusEl) {
          statusEl.innerHTML = `
            <span style="color: #28a745; font-weight: bold; font-size: 1.1rem;">
              ✓ Data submitted successfully! / 資料已成功送出！
            </span><br><br>
            Thank you for participating. You may now close this window.
          `;
        }
      } else {
        if (statusEl) {
          statusEl.innerHTML = `
            <span style="color: #d9534f; font-weight: bold;">
              ⚠ Online submission failed.
            </span><br>
            Please click below to download your data file manually.
          `;
          jsPsych.data.get().localSave('csv', filename);
        }
      }
      if (finishBtn) finishBtn.style.display = 'inline-block';
    })
    .catch(error => {
      console.error("DataPipe Error:", error);
      const statusEl = document.getElementById('upload-status');
      if (statusEl) {
        statusEl.innerHTML = `
          <span style="color: #d9534f; font-weight: bold;">
            ⚠ Transmission error.
          </span><br>
          Downloading data file locally as backup...
        `;
      }
      jsPsych.data.get().localSave('csv', filename);
      if (finishBtn) finishBtn.style.display = 'inline-block';
    });
  }
};
timeline.push(save_and_debrief);

// Run the experiment
jsPsych.run(timeline);
