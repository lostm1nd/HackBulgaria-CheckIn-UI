/* globals $, alert, Chart */

$(document).ready(function() {
  'use strict';

  var attendaceByDate = {};

  $.ajax({
    type: 'GET',
    url: 'https://hackbulgaria.com/api/checkins/',
    dataType: 'json',
    success: function(checkins) {
      getCourseAttendaceByDates(checkins);
      drawCoursePulse();
    },
    error: function() {
      alert('There might be a problem with the server. Try later.');
    }
  });

  function getCourseAttendaceByDates(checkins) {
    checkins.forEach(function(checkin) {

      if (checkin.student_courses) {
        checkin.student_courses.forEach(function(course) {
          var courseName = course.name + ' ' + course.group;

          if (attendaceByDate[courseName]) {

            if (attendaceByDate[courseName][checkin.date]) {
              attendaceByDate[courseName][checkin.date] += 1;
            } else {
              attendaceByDate[courseName][checkin.date] = 1;
            }

          } else {
            attendaceByDate[courseName] = {};
            attendaceByDate[courseName][checkin.date] = 1;
          }

        });
      }

    });

    console.log(attendaceByDate);
  }

  function drawCoursePulse() {
    var canvasCtx = document.getElementById('javascript-chart').getContext('2d');

    var studentCount = Object.keys(attendaceByDate['Frontend JavaScript 1']).map(function(date) {
      return attendaceByDate['Frontend JavaScript 1'][date];
    });

    var lineChart = new Chart(canvasCtx).Line({
      labels: Object.keys(attendaceByDate['Frontend JavaScript 1']),
      datasets: [{
        label: 'Frontend JavaScript 1',
        fillColor: 'rgba(0,0,0,0)',
        strokeColor: 'blue',
        pointColor: 'orange',
        data: studentCount
      }]
    }, {
      bezierCurve: false
    });
  }

});
