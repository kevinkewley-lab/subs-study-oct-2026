// Initialize jsPsych
const jsPsych = initJsPsych({
  on_finish: function () {
    // Optional backup: locally downloads a copy to the user's browser
    // You can keep or delete this line depending on your preference
    // jsPsych.data.get().localSave('csv', filename);
  }
});

// Identify participant and condition
const conditionTag = window.EXPERIMENT_CONDITION || 'default';
const subject_id = jsPsych.randomization.randomID(10);
const filename = `${conditionTag}_${subject_id}.csv`;

// Ensure every single trial row in the CSV records the participant ID and condition
jsPsych.data.addProperties({
  subject: subject_id,
  condition: conditionTag
});

// Create master timeline
const timeline = [];

// ==========================================
// 1. Participant Details Form
// ==========================================
const participant_info = {
  type: jsPsychSurveyHtmlForm,
  html: `
    <div style="text-align: left; max-width: 520px; margin: 0 auto; font-family: sans-serif; font-size: 1rem; line-height: 1.5;">
      <h2 style="text-align: center; margin-bottom: 24px;">Participant Information / 受試者基本資料</h2>

      <!-- Participant ID -->
      <div style="margin-bottom: 20px;">
        <label for="p_id" style="font-weight: bold; display: block; margin-bottom: 6px;">
          Participant ID / 代號:
        </label>
        <input 
          type="text" 
          id="p_id" 
          name="participant_id" 
          required 
          autocomplete="off"
          placeholder="e.g. A115123456"
          style="width: 100%; padding: 8px; border: 1px solid #aaa; border-radius: 4px; box-sizing: border-box;"
        />
      </div>

      <!-- Age -->
      <div style="margin-bottom: 20px;">
        <label for="age" style="font-weight: bold; display: block; margin-bottom: 6px;">
          Age / 年齡:
        </label>
        <input 
          type="number" 
          id="age" 
          name="age" 
          min="1" 
          max="120" 
          required 
          style="width: 100%; padding: 8px; border: 1px solid #aaa; border-radius: 4px; box-sizing: border-box;"
          placeholder="e.g., 20"
        />
      </div>

      <!-- Sex -->
      <div style="margin-bottom: 20px;">
        <p style="font-weight: bold; margin: 0 0 8px 0;">Sex / 性別:</p>
        <label style="display: inline-block; margin-right: 20px; cursor: pointer;">
          <input type="radio" name="sex" value="Male" required> Male 男
        </label>
        <label style="display: inline-block; cursor: pointer;">
          <input type="radio" name="sex" value="Female" required> Female 女
        </label>
      </div>

      <!-- Native Language -->
      <div style="margin-bottom: 24px;">
        <p style="font-weight: bold; margin: 0 0 8px 0;">Native Language / 母語:</p>
        
        <label style="display: block; margin-bottom: 8px; cursor: pointer;">
          <input 
            type="radio" 
            name="native_language" 
            value="Mandarin" 
            required 
            onclick="document.getElementById('other_lang_input').required = false; document.getElementById('other_lang_box').style.display = 'none';"
          > Mandarin 中文
        </label>

        <label style="display: block; margin-bottom: 8px; cursor: pointer;">
          <input 
            type="radio" 
            name="native_language" 
            value="English" 
            required 
            onclick="document.getElementById('other_lang_input').required = false; document.getElementById('other_lang_box').style.display = 'none';"
          > English 英文
        </label>

        <label style="display: block; margin-bottom: 8px; cursor: pointer;">
          <input 
            type="radio" 
            name="native_language" 
            value="Other" 
            required 
            onclick="document.getElementById('other_lang_input').required = true; document.getElementById('other_lang_box').style.display = 'block';"
          > Other (please state) 其他（請註明）
        </label>

        <div id="other_lang_box" style="display: none; margin-left: 24px; margin-top: 8px;">
          <input 
            type="text" 
            id="other_lang_input" 
            name="other_language_specified" 
            placeholder="Please specify / 請填寫母語"
            style="width: 100%; padding: 8px; border: 1px solid #aaa; border-radius: 4px; box-sizing: border-box;"
          />
        </div>
      </div>

    </div>
  `,
  button_label: 'Begin / 開始',
  on_finish: function (data) {
    const responses = data.response;

    const finalLanguage = responses.native_language === 'Other' && responses.other_language_specified
      ? responses.other_language_specified.trim()
      : responses.native_language;

    jsPsych.data.addProperties({
      participant_id: responses.participant_id,
      age: responses.age,
      sex: responses.sex,
      native_language: finalLanguage
    });
  }
};
timeline.push(participant_info);

// ==========================================
// 2. Instructions Screen
// ==========================================
const instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="max-width: 700px; margin: 0 auto; line-height: 1.6; text-align: left; font-family: sans-serif;">
      <h2 style="text-align: center;">Instructions / 實驗說明</h2>
      <p>1. You will watch a short video. Please pay close attention to the spoken dialogue and content.</p>
      <p>2. Following the video, you will listen to 13 short audio excerpts.</p>
    </div>
  `,
  choices: ['Start Video / 開始觀看影片']
};
timeline.push(instructions);

// ==========================================
// 3. Video Presentation
// ==========================================
const video_trial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    const videoSrc = window.VIDEO_SOURCE || 'media/main_video.mp4';
    return `
      <div style="max-width: 720px; margin: 0 auto;">
        <video id="stimulus-video" width="100%" controls playsinline>
          <source src="${videoSrc}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    `;
  },
  choices: ['Video Finished - Proceed / 影片結束，下一步'],
  data: { phase: 'video_presentation' }
};
timeline.push(video_trial);

// ==========================================
// 4. Audio Items Configuration (14 Stimuli)
// ==========================================
const audio_items = [
  { audio: 'media/excerpt_1.mp3',  item_id: 1,  target_word: 'word1', in_video: true },
  { audio: 'media/excerpt_2.mp3',  item_id: 2,  target_word: 'word2', in_video: true },
  { audio: 'media/excerpt_3.mp3',  item_id: 3,  target_word: 'word3', in_video: false },
  { audio: 'media/excerpt_4.mp3',  item_id: 4,  target_word: 'word4', in_video: true },
  { audio: 'media/excerpt_5.mp3',  item_id: 5,  target_word: 'word5', in_video: false },
  { audio: 'media/excerpt_6.mp3',  item_id: 6,  target_word: 'word6', in_video: true },
  { audio: 'media/excerpt_7.mp3',  item_id: 7,  target_word: 'word7', in_video: true },
  { audio: 'media/excerpt_8.mp3',  item_id: 8,  target_word: 'word8', in_video: false },
  { audio: 'media/excerpt_9.mp3',  item_id: 9,  target_word: 'word9', in_video: true },
  { audio: 'media/excerpt_10.mp3', item_id: 10, target_word: 'word10', in_video: false },
  { audio: 'media/excerpt_11.mp3', item_id: 11, target_word: 'word11', in_video: true },
  { audio: 'media/excerpt_12.mp3', item_id: 12, target_word: 'word12', in_video: false },
  { audio: 'media/excerpt_13.mp3', item_id: 13, target_word: 'word13', in_video: true },
];

// ==========================================
// Combined Audio Player + Dual Questions
// ==========================================
const audio_combined_trial = {
  type: jsPsychSurveyHtmlForm,
  html: function() {
    const audioSrc = jsPsych.evaluateTimelineVariable('audio');

    return `
      <div style="text-align: left; max-width: 650px; margin: 0 auto; font-family: sans-serif; font-size: 1.05rem; line-height: 1.6;">
        
        <!-- Hidden input tracking play count -->
        <input type="hidden" id="audio_play_count" name="audio_play_count" value="0">

        <!-- Audio Player Container -->
        <div style="text-align: center; margin-bottom: 25px; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">🎧 Audio Excerpt / 音檔播放</p>
          <audio 
            id="audio_player" 
            controls 
            controlslist="nodownload" 
            preload="auto" 
            style="width: 100%; max-width: 400px;"
            onplay="document.getElementById('audio_play_count').value = parseInt(document.getElementById('audio_play_count').value) + 1;"
          >
            <source src="${audioSrc}" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
          <p style="margin: 8px 0 0 0; font-size: 0.85rem; color: #666;">You may replay the audio as many times as needed. / 您可以重複聆聽。</p>
        </div>

        <!-- Question 1: Recognition Choice -->
        <div style="margin-bottom: 24px;">
          <p style="font-weight: bold; margin-bottom: 12px;">
            1. Did the word appear in the video you just watched?<br>
            <span style="font-weight: normal; color: #444;">你剛剛觀看的影片裡出現過這個詞嗎？</span>
          </p>
          <label style="display: block; margin: 8px 0; cursor: pointer;">
            <input type="radio" name="recognition" value="Yes" required> Yes 聽到
          </label>
          <label style="display: block; margin: 8px 0; cursor: pointer;">
            <input type="radio" name="recognition" value="No" required> No 沒聽到
          </label>
          <label style="display: block; margin: 8px 0; cursor: pointer;">
            <input type="radio" name="recognition" value="Not sure" required> Not sure 沒有把握
          </label>
        </div>

        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">

        <!-- Question 2: Translation Short Answer -->
        <div style="margin-bottom: 24px;">
          <p style="font-weight: bold; margin-bottom: 12px;">
            2. Write the Mandarin translation of the key word.<br>
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
    appeared_in_video: jsPsych.timelineVariable('in_video')
  },
  on_finish: function(data) {
    data.recognition_response = data.response.recognition;
    data.mandarin_translation = data.response.mandarin_translation;
    data.audio_play_count = parseInt(data.response.audio_play_count, 10);
    data.time_spent_seconds = (data.rt / 1000).toFixed(2);
  }
};

// Procedure
const audio_procedure = {
  timeline: [audio_combined_trial],
  timeline_variables: audio_items,
  randomize_order: true
};
timeline.push(audio_procedure);

// ==========================================
// 5. DataPipe Save & Completion Screen
// ==========================================

// Send data to DataPipe before the debrief
const save_data = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: "Dkh9QFetwDLM",
  filename: filename,
  data_string: () => jsPsych.data.get().csv()
};
timeline.push(save_data);

const debrief = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif; line-height: 1.6;">
      <h2>Experiment Completed / 實驗結束</h2>
      <p>Thank you for your participation. Your responses have been saved.</p>
      <p>感謝您的參與，受試資料已成功送出。</p>
    </div>
  `,
  choices: ['Finish / 結束']
};
timeline.push(debrief);

// Run the experiment
jsPsych.run(timeline);