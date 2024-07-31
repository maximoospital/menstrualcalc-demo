<template>
  <div class="calendar-container">
    <div class="calendar">
      <div class="month">
        <h5>{{ formatMonthYear(monthyear) }}</h5>
      </div>
      <div class="calendar-grid">
        <!-- Weekday headers -->
        <div class="calendar-header" v-for="weekday in weekdays" :key="weekday">
          {{ weekday }}
        </div>
        <!-- Empty slots for days before the first day of the month -->
        <div v-for="n in emptyDays" :key="'empty-' + n" class="empty-day"></div>
        <!-- Days of the month -->
        <div v-for="day in daysInMonth" :key="day" :style="getEventStyle(day, monthyear)" class="calendar-day">
          {{ day }}
        </div>
      </div>
    </div>
    <div class="calendar">
      <div class="month">
        <h5>{{ formatMonthYear(nextMonthYear) }}</h5>
      </div>
      <div class="calendar-grid">
        <!-- Weekday headers -->
        <div class="calendar-header" v-for="weekday in weekdays" :key="weekday">
          {{ weekday }}
        </div>
        <!-- Empty slots for days before the first day of the next month -->
        <div v-for="n in nextEmptyDays" :key="'next-empty-' + n" class="empty-day"></div>
        <!-- Days of the next month -->
        <div v-for="day in nextDaysInMonth" :key="day" :style="getEventStyle(day, nextMonthYear)" class="calendar-day">
          {{ day }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calc-Calendar',
  props: {
    monthyear: {
      type: String,
      required: true
    },
    events: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    };
  },
  computed: {
    daysInMonth() {
      const [year, month] = this.monthyear.split('-');
      const days = new Date(year, month, 0).getDate();
      return Array.from({ length: days }, (_, i) => i + 1);
    },
    firstDayOfMonth() {
      const [year, month] = this.monthyear.split('-');
      const date = new Date(year, month - 1, 1);
      return date.getDay();
    },
    emptyDays() {
      return Array.from({ length: this.firstDayOfMonth }, (_, i) => i);
    },
    nextMonthYear() {
      const [year, month] = this.monthyear.split('-');
      const nextMonth = new Date(year, month, 1);
      return `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;
    },
    nextDaysInMonth() {
      const [year, month] = this.nextMonthYear.split('-');
      const days = new Date(year, month, 0).getDate();
      return Array.from({ length: days }, (_, i) => i + 1);
    },
    nextFirstDayOfMonth() {
      const [year, month] = this.nextMonthYear.split('-');
      const date = new Date(year, month - 1, 1);
      return date.getDay();
    },
    nextEmptyDays() {
      return Array.from({ length: this.nextFirstDayOfMonth }, (_, i) => i);
    }
  },
  methods: {
  getEventStyle(day, monthyear) {
    const [year, month] = monthyear.split('-');
    const currentDate = new Date(year, month - 1, day);

    for (const event of this.events) {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      if (currentDate >= startDate && currentDate <= endDate) {
        return { backgroundColor: event.color, color: 'white'};
      }
    }
    return {};
  },
  formatMonthYear(monthyear){
    const [year, month] = monthyear.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }
}
}
</script>

<style scoped>
.calendar-container {
  display: flex;
  justify-content: space-around;
  gap:110px;
}

.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: black;
  font-size: 18px;
  border: 1px solid #ccc;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0px;
}

.calendar-header {
  font-weight: bold;
  text-align: center;
  margin-top: 5px;
}

.month {
  font-weight: bold;
  text-align: center;
  width: 100%;
  font-size: 20px;
  padding: 0px;
  margin: 0px;
  padding-bottom: 0px;
  border-bottom: 1px solid #ccc;
}

h5 {
  margin: 5px;
  padding: 10px;
}

.empty-day {
  visibility: hidden;
}

.calendar-day {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 46px;
}
</style>