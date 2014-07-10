/* globals $, alert, Chart */

$(document).ready(function() {
  'use strict';

  var canvasCtx = document.getElementById('javascript-chart').getContext('2d'),
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
      courses = getAllCourses(courseAttendaceByDate).sort();
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

    console.log(result);
    return result;
  }

  function getAllCourses(data) {
    return Object.keys(data);
  }

  function drawCoursePulse(course, ctx) {
    $courseTitle.text(course);

    var studentCount = Object.keys(courseAttendaceByDate[course]).map(function(date) {
      return courseAttendaceByDate[course][date];
    });

    var lineChart = new Chart(ctx).Line({
      labels: Object.keys(courseAttendaceByDate[course]),
      datasets: [{
        label: course,
        fillColor: 'rgba(0,0,0,0)',
        strokeColor: 'blue',
        pointColor: 'orange',
        data: studentCount
      }]
    }, {
      bezierCurve: false
    });
  }

  $('span.left-arrow').on('click', function() {
    if (courseToDraw > 0) {
      drawCoursePulse(courses[courseToDraw--], canvasCtx);
    }
  });

  $('span.right-arrow').on('click', function() {
    if (courseToDraw < courses.length - 1) {
      drawCoursePulse(courses[courseToDraw++], canvasCtx);
    }
  });

});
