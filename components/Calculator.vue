<template>
  <div>
    <div class="inputs">
          <div class="input-selects">
            <div>
              <label for="start-date" class="input-label" style="color: #ff3766;">Last Period</label>
              <input type="date" id="start-date" name="start-date" class="date-select" :min="minDate" :max="maxDate" v-model="startDate">
            </div>
            <div>
              <label for="period-length" class="input-label" style="color: #ff3766;">Period Length</label>
              <select id="period-length" name="period-length" class="number-select" v-model="periodLength">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>                
              </select>
            </div>
            <div>
              <label for="cycle-length" class="input-label" style="color: #ff3766;">Cycle Length</label>
              <select id="cycle-length" name="cycle-length" class="number-select" v-model="cycleLength">
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
                <option value="32">32</option>
                <option value="33">33</option>
                <option value="34">34</option>
                <option value="35">35</option>
                <option value="36">36</option>
                <option value="37">37</option>
              </select>
            </div>
          </div>
          <div>
            <button class="submit" id="botoncalc" @click="submitButton">CALCULATE</button>
          </div>
        </div>
      <div v-if="showCalendar" class="calendars-container" id="calendar">
          <div class="month-buttons">
            <button class="previous-month" @click="previousMonth">&#60;- PREVIOUS</button>
            <div></div>
            <button class="next-month" @click="nextMonth">NEXT -&#62;</button>
          </div>
          <div class="mt-1">
            <calc-calendar :monthyear="selectedMonthYear" :events="events"></calc-calendar>
          </div>
          <div class="ad" v-if="showAds">
            <h1>Period is Almost Here!</h1>
            <h2>Ladysoft recommends:</h2>
            <div class="input-selects">
              <img src="/normal.png" alt="Normal" style="width: 250px;">
              <img src="/proteccion.png" alt="Proteccion" style="width: 250px;">
              <img src="/telasuave.png" alt="Tela Suave" style="width: 250px;">
            </div>
          </div>
          <div class="input-selects" id="cal-but">
            <div style="text-align: center; margin-top: 5px;">
              <p style="color:#ff3766; margin-bottom: 0;">■ - Period</p>
              <button class="submit" style="background-color:#ff3766;" @click="exportToGoogleCalendar('Periodo')">Export to Google Calendar</button>
            </div>
            <div style="text-align: center; margin-top: 5px;">
              <p style="color:#f888a1; margin-bottom: 0;">■ - Self-exam</p>
              <button class="submit" style="background-color:#f888a1;" @click="exportToGoogleCalendar('Autoexamen')">Export to Google Calendar</button>
            </div>
            <div style="text-align: center; margin-top: 5px;">
              <p style="color:#7f3766; margin-bottom: 0;">■ - Ovulation</p>
              <button class="submit" style="background-color:#7f3766;" @click="exportToGoogleCalendar('Ovulacion')">Export to Google Calendar</button>
            </div>
          </div>
          <p style="text-align: center;">This data is referential. <b>It's always better to consult with a professional.</b></p>
      </div>
  </div>
</template>

<script>
import CalcCalendar from './Calc-Calendar.vue';

export default {
  name: 'Calculator',
  components: {
    CalcCalendar
  },
  data() {
    return {
      startDate: this.formatDate(new Date()),
      periodLength: 5,
      cycleLength: 28,
      firstRun: true,
      showCalendar: false,
      selectedMonthYear: '',
      showAds: false,
      minDate: '',
      maxDate: '',
      maxFutureDate: new Date(),
      maxPastDate: new Date(),
      events: []
    }
  },
  created() {
    this.setMinAndMaxDate();
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + (d.getDate());
      const year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    },
    getCorrectDate(date) {
      const adjustedDate = new Date(date);
      adjustedDate.setMinutes(adjustedDate.getMinutes() + adjustedDate.getTimezoneOffset());
      return adjustedDate;
    },
    setMinAndMaxDate() {
      let today = new Date();
      let twoYearsAgo = new Date(today.setFullYear(today.getFullYear() - 2));
      let year = twoYearsAgo.getFullYear();
      let month = String(twoYearsAgo.getMonth() + 1).padStart(2, '0');
      let day = String(twoYearsAgo.getDate()).padStart(2, '0');
      this.minDate = `${year}-${month}-${day}`;
      let twoYearsFromNow = new Date(today.setFullYear(today.getFullYear() + 4));
      let yearFut = twoYearsFromNow.getFullYear();
      let monthFut = String(twoYearsFromNow.getMonth() + 1).padStart(2, '0');
      let dayFut = String(twoYearsFromNow.getDate()).padStart(2, '0');
      this.maxDate = `${yearFut}-${monthFut}-${dayFut}`;
      console.log(this.minDate, this.maxDate);
      
    },
    event(date, length, title, color) {
      return {
        start: date,
        end: this.formatDate(new Date(new Date(date).setDate(new Date(date).getDate() + length + 1))),
        title: title,
        color: color
      }
    },
    addEvent(date, length, title, color) {
      this.events.push(this.event(date, length, title, color));
    },
    addCycle(startDate, periodoLength) {
      let date = new Date(startDate);
      let periodLength = parseInt(periodoLength);
      let cycleLength = parseInt(this.cycleLength);
      this.cycleLength = cycleLength;
      let autoExamDate = new Date(date);
      autoExamDate.setDate(date.getDate() + periodLength + 1);
      let ovulationDate = new Date(date);
      ovulationDate.setDate(date.getDate() - 18);
      this.addEvent(this.formatDate(date), periodLength, 'Periodo', '#ff3766');
      this.addEvent(this.formatDate(autoExamDate), 1, 'Autoexamen', '#f888a1');
      this.addEvent(this.formatDate(ovulationDate), 5, 'Ovulacion', '#7f3766');
    },
    DoesDateStartPeriod(date) {
      let periodEvents = this.events.filter(event => event.title === 'Periodo');
      return periodEvents.some( event => event.start === this.formatDate(date) );
    },
    showAd() {
      let today = new Date();
      let todayFiveDaysFromNow = new Date();
      todayFiveDaysFromNow.setDate(today.getDate() + 5);
      today = this.getCorrectDate(this.formatDate(today));
      todayFiveDaysFromNow = this.getCorrectDate(this.formatDate(todayFiveDaysFromNow));
      for(let i = 0; i < 5; i++) {
        if(this.DoesDateStartPeriod(today)) {
          this.showAds = true;
          this.$nextTick(() => {
            const adElement = document.querySelector('.ad');
            if (adElement) {
              setTimeout(() => {
                adElement.classList.add('visible');
              }, 20);
              setTimeout(() => {
                document.querySelector('.ad').scrollIntoView({ behavior: 'smooth' });
              }, 20); // Wait for the opacity transition to complete
            }
          });
          break;
        } else {
          this.showAds = false;
        }
        today.setDate(today.getDate() + 1);
        document.querySelector('#calendar').scrollIntoView({ behavior: 'smooth' });
      }
    },
    submitButton() {
      this.events = [];
      let preCycle = new Date(this.getCorrectDate(this.startDate));
      this.addCycle(this.getCorrectDate(this.startDate), this.periodLength);
      let postCycle = new Date(this.getCorrectDate(this.startDate));
      for (let i = 0; i < 30; i++) {
        postCycle.setDate(postCycle.getDate() + this.cycleLength + 1);
        this.addCycle(this.formatDate(postCycle), this.periodLength);
      };
      for (let i = 0; i > -30; i--) {
        preCycle.setDate(preCycle.getDate() - this.cycleLength - 1);
        this.addCycle(this.formatDate(preCycle), this.periodLength);
      };
      this.selectedMonthYear = this.formatDate(this.getCorrectDate(this.startDate)).substring(0, 7);
      this.maxFutureDate = new Date(this.getCorrectDate(this.startDate));
      this.maxFutureDate.setFullYear(this.maxFutureDate.getFullYear() + 2);
      this.maxPastDate = new Date(this.getCorrectDate(this.startDate));
      this.maxPastDate.setFullYear(this.maxPastDate.getFullYear() - 2);
      this.showCalendar = true;
      this.$nextTick(() => {
        this.showAd();
      });
    },
    nextMonth() {
      this.showCalendar = false;
      if(this.selectedMonthYear < this.formatDate(this.maxFutureDate)) {
        let [year, month] = this.selectedMonthYear.split('-').map(Number);
        month += 1;
        if (month > 12) {
          month = 1;
          year += 1;
        }
        this.selectedMonthYear = `${year}-${String(month).padStart(2, '0')}`;
        month += 1;
        if (month > 12) {
          month = 1;
          year += 1;
        }
        this.selectedMonthYear = `${year}-${String(month).padStart(2, '0')}`;
      }
      this.showCalendar = true;
    },
    previousMonth() {
      this.showCalendar = false;
      if(this.selectedMonthYear > this.formatDate(this.maxPastDate)) {
        let [year, month] = this.selectedMonthYear.split('-').map(Number);
        month -= 1;
        if (month < 1) {
          month = 12;
          year -= 1;
        }
        this.selectedMonthYear = `${year}-${String(month).padStart(2, '0')}`;
        month -= 1;
        if (month < 1) {
          month = 12;
          year -= 1;
        }
        this.selectedMonthYear = `${year}-${String(month).padStart(2, '0')}`;
      }
      this.showCalendar = true;
    },
    exportToGoogleCalendar(eventType = '') {
      const baseUrl = 'https://calendar.google.com/calendar/r/eventedit';
      switch (eventType) {
        case 'Periodo':
          let periodStart = this.startDate;
          let periodEnd = new Date(this.startDate);
          periodEnd.setDate(periodEnd.getDate() + this.periodLength);
          periodEnd = this.getCorrectDate(periodEnd).toISOString().replace(/-|:|\.\d\d\d/g, '');
          periodStart = this.getCorrectDate(periodStart).toISOString().replace(/-|:|\.\d\d\d/g, '');
          window.open(`${baseUrl}?text=${encodeURIComponent(eventType)}&dates=${periodStart}/${periodEnd}`, '_blank');
          break;
        case 'Autoexamen':
          let selfExamStart = new Date(this.startDate);
          let selfExamEnd = new Date(this.startDate);
          selfExamStart.setDate(selfExamStart.getDate() + this.periodLength + 1);
          selfExamStart = this.getCorrectDate(selfExamStart).toISOString().replace(/-|:|\.\d\d\d/g, '');
          selfExamEnd.setDate(selfExamEnd.getDate() + this.periodLength + 2);
          selfExamEnd = this.getCorrectDate(selfExamEnd).toISOString().replace(/-|:|\.\d\d\d/g, '');
          window.open(`${baseUrl}?text=${encodeURIComponent(eventType)}&dates=${selfExamStart}/${selfExamEnd}`, '_blank');
          break;
        case 'Ovulacion':
          let ovulationStart = new Date(this.startDate);
          let ovulationEnd = new Date(this.startDate);
          ovulationStart.setDate(ovulationStart.getDate() + this.cycleLength + 1 - 18);
          ovulationStart = this.getCorrectDate(ovulationStart).toISOString().replace(/-|:|\.\d\d\d/g, '');
          ovulationEnd.setDate(ovulationEnd.getDate() + this.cycleLength + 1 - 13);
          ovulationEnd = this.getCorrectDate(ovulationEnd).toISOString().replace(/-|:|\.\d\d\d/g, '');
          window.open(`${baseUrl}?text=${encodeURIComponent(eventType)}&dates=${ovulationStart}/${ovulationEnd}`, '_blank');
          break;
        default:
          break;
      }
   }
  }
}
</script>

<style>
  .inputs {
    display: grid;
    margin-top: 0.75rem; 
    grid-template-rows: repeat(1, minmax(0, 1fr)); 
    gap: 0.25rem; 
  }
  .input-selects {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr)); 
    gap: 0.25rem; 
  }
  .input-label {
    display: block; 
    font-size: 0.875rem;
    line-height: 1.25rem; 
    font-weight: 500; 
    color: #374151; 
  }
  .date-select {
    display: block; 
    padding-right: 0.5rem; 
    padding-left: 0.5rem; 
    margin-top: 0.25rem; 
    border-radius: 0; 
    width: 100%; 
    height: 3rem; 
    font-size: 18px;
    font-weight: 700; 
    color: #ffffff; 
    background: #ff3766;
    cursor: pointer;
  }
  .number-select {
    display: block; 
    margin-top: 0.25rem; 
    border-radius: 0; 
    width: 100%; 
    height: 3rem; 
    font-weight: 700; 
    font-size: 18px;
    text-align: center; 
    color: #ffffff; 
    background: #ff3766;
    cursor: pointer;
  }
  .submit {
    border-radius: 0; 
    width: 100%; 
    z-index: 1;
    display: inline-block;
    position: relative;
    height: 3rem; 
    font-weight: 700; 
    color: #ffffff; 
    background: #7f3766;
  }
  .submit:hover {
    color: #fff;
    cursor: pointer;
  }
  .submit:after {
    background-color: #000000; 
    position: absolute;
    content: "";
    width: 100%;
    height: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    transition: all .3s ease;
    -webkit-transition: all .3s ease;
  }
  .submit:hover:after{
    top: 0;
    height: 100%;
  }
  .calendars-container {
    display: grid;
    grid-template-rows: repeat(1, minmax(0, 2fr)); 
    gap: 0.25rem; 
  }
  .month-buttons {
    display: grid;
    margin-top: 0.25rem; 
    grid-template-columns: repeat(3, minmax(0, 1fr)); 
    gap: 1.25rem; 
  }
  .previous-month {
    display: block; 
    border-radius: 0; 
    width: 100%; 
    height: 3rem; 
    text-align: left; 
    background-color: transparent; 
    color: #7f3766;
  }
  .previous-month:hover {
    font-weight: 700; 
  }
  .next-month {
    display: block; 
    border-radius: 0; 
    width: 100%; 
    height: 3rem; 
    text-align: right; 
    background-color: transparent; 
    color: #7f3766;
  }
  .next-month:hover {
    font-weight: 700; 
  }
  .ad {
    text-align: center;
    font-size: 28px;
    color: #ffffff;
    text-shadow: 2px 3px 2px #f888a1;
    line-height: 35px;
    font-weight: 700;
    padding: 20px;
    margin: 10px 0px 10px 0px;
    background-color: #ff3766;
    border-radius: 25px;
    opacity: 0;
    transition: opacity 1s ease-in-out;
  }
  .ad.visible {
  opacity: 1;
  }
  .ad h2 {
    font-size: 24px;
    color: #ffffff;
    font-weight: 700;
  }
</style>