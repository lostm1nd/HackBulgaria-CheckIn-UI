/* globals $, alert, Chart */

$(document).ready(function() {
  'use strict';

  var canvasCtx = document.getElementById('chart').getContext('2d'),
      $courseTitle = $('#course-title'),
      courseAttendaceByDate = {},
      courses = [],
      courseToDraw = 0;

  $.ajax({
    type: 'GET',
    url: 'https://hackbulgaria.com/api/checkins/',
    dataType: 'json',
    success: function(checkins) {
      courseAttendaceByDate = getCourseAttendaceByDates(checkins);
      courses = getObjectKeys(courseAttendaceByDate).sort();
      drawCoursePulse(courses[courseToDraw], canvasCtx);
    },
    error: function() {
      alert('There might be a problem with the server. Try later.');
    }
  });

  function getCourseAttendaceByDates(checkins) {
    var result = {};

    checkins.forEach(function(checkin) {

      if (checkin.student_courses) {
        checkin.student_courses.forEach(function(course) {
          var courseName = course.name + ' ' + course.group;

          if (result[courseName]) {

            if (result[courseName][checkin.date]) {
              result[courseName][checkin.date] += 1;
            } else {
              result[courseName][checkin.date] = 1;
            }

          } else {
            result[courseName] = {};
            result[courseName][checkin.date] = 1;
          }

        });
      }

    });

    return result;
  }

  function getObjectKeys(data) {
    return Object.keys(data);
  }

  function drawCoursePulse(course) {
    var canvas = UtilitiesModule.getNewCanvas(),
        canvasWidth = parseInt(canvas.style.width, 10),
        canvasHeight = parseInt(canvas.style.height, 10),
        ctx = canvas.getContext('2d'),
        courseDates = Object.keys(courseAttendaceByDate[course]),
        studentCount = courseDates.map(function(date) {
          return courseAttendaceByDate[course][date];
        });

    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;
    $('#chart').replaceWith(canvas);
    $courseTitle.text(course);

    Chart.defaults.global.scaleIntegersOnly = true;
    Chart.defaults.global.scaleBeginAtZero = true;

    var lineChart = new Chart(ctx).Line({
      labels: courseDates,
      datasets: [{
        label: course,
        fillColor: 'rgba(0,0,0,0)',
        strokeColor: '#02283A',
        pointColor: '#CD332D',
        data: studentCount
      }]
    }, {
      bezierCurve: false
    });
  }

  $('span.left-arrow').on('click', function() {
    if (courseToDraw > 0) {
      courseToDraw -= 1;
      drawCoursePulse(courses[courseToDraw], canvasCtx);
    }
  });

  $('span.right-arrow').on('click', function() {
    if (courseToDraw < courses.length - 1) {
      courseToDraw += 1;
      drawCoursePulse(courses[courseToDraw], canvasCtx);
    }
  });

});
