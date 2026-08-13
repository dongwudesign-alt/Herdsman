// ============================================
// Meeting Pages Common JavaScript
// Shared across: meeting-home, meeting-recoding, meeting-summary
// ============================================

(function() {
  'use strict';

  // ---- Sidebar Toggle ----
  var sidebarWrapper = document.getElementById('sidebarWrapper');
  var closeBtn = document.getElementById('btnCloseSidebar');

  function openSidebar() {
    if (sidebarWrapper) sidebarWrapper.classList.add('expanded');
  }

  function closeSidebar() {
    if (sidebarWrapper) sidebarWrapper.classList.remove('expanded');
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeSidebar();
    });
  }

  // ---- Window Controls ----
  var winMinimize = document.querySelector('.win-btn.minimize');
  var winMaximize = document.querySelector('.win-btn.maximize');
  var winClose = document.querySelector('.win-btn.close');

  if (winMinimize) {
    winMinimize.addEventListener('click', function() {
      console.log('Window minimize');
    });
  }

  if (winMaximize) {
    winMaximize.addEventListener('click', function() {
      var appWindow = document.querySelector('.app-window');
      if (appWindow) appWindow.classList.toggle('maximized');
    });
  }

  if (winClose) {
    winClose.addEventListener('click', function() {
      console.log('Window close');
    });
  }

  // ---- Participants / Notes Tab Switching ----
  var tabParticipants = document.getElementById('tabParticipants');
  var tabNotes = document.getElementById('tabNotes');
  var participantsList = document.getElementById('participantsList');
  var notesList = document.getElementById('notesList');
  var searchWrap = document.getElementById('searchWrap');

  if (tabParticipants && tabNotes) {
    tabParticipants.addEventListener('click', function() {
      tabParticipants.classList.add('active');
      tabNotes.classList.remove('active');
      if (participantsList) participantsList.classList.remove('hide');
      if (searchWrap) searchWrap.classList.remove('hide');
      if (notesList) notesList.classList.remove('show');
    });

    tabNotes.addEventListener('click', function() {
      tabNotes.classList.add('active');
      tabParticipants.classList.remove('active');
      if (participantsList) participantsList.classList.add('hide');
      if (searchWrap) searchWrap.classList.add('hide');
      if (notesList) notesList.classList.add('show');
    });
  }

  // ---- Notes Word Count ----
  var notesTextarea = document.getElementById('notesTextarea');
  var notesCount = document.getElementById('notesCount');

  function updateNotesCount() {
    if (notesTextarea && notesCount) {
      notesCount.textContent = notesTextarea.value.length + ' 字';
    }
  }

  if (notesTextarea) {
    notesTextarea.addEventListener('input', updateNotesCount);
    updateNotesCount();
  }

  // ---- History Item Selection ----
  var mtItems = document.querySelectorAll('.mt-item');
  mtItems.forEach(function(item) {
    item.addEventListener('click', function() {
      mtItems.forEach(function(i) { i.classList.remove('active'); });
      item.classList.add('active');
    });
  });

  // ---- New Meeting Button ----
  var newMeetingBtn = document.getElementById('newMeetingBtn');
  if (newMeetingBtn) {
    newMeetingBtn.addEventListener('click', function() {
      window.location.href = 'meeting-home.html';
    });
  }

  // ---- Search Participants ----
  var searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      var query = this.value.trim().toLowerCase();
      document.querySelectorAll('.mt-participant').forEach(function(p) {
        var name = p.querySelector('.mt-participant-name').textContent.toLowerCase();
        var role = p.querySelector('.mt-participant-role').textContent.toLowerCase();
        p.style.display = (name.indexOf(query) !== -1 || role.indexOf(query) !== -1) ? '' : 'none';
      });
    });
  }

  // ---- Remove Participant ----
  function setupRemoveButtons() {
    document.querySelectorAll('.mt-participant-remove').forEach(function(btn) {
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var p = this.closest('.mt-participant');
        p.style.transition = 'all 0.3s ease';
        p.style.opacity = '0';
        p.style.transform = 'translateX(20px)';
        setTimeout(function() {
          p.remove();
          updateParticipantCount();
        }, 300);
      });
    });
  }
  setupRemoveButtons();

  // ---- Update Participant Count ----
  function updateParticipantCount() {
    var count = document.querySelectorAll('.mt-participant').length;
    var el = document.getElementById('participantCount');
    if (el) el.textContent = count;
    // Also update recoding page count
    var recCount = document.getElementById('recCount');
    if (recCount) recCount.textContent = count + ' 参会人员';
  }

  // ---- Add Participant Modal ----
  var addBtn = document.getElementById('addBtn');
  var addModal = document.getElementById('addModal');
  var modalClose = document.getElementById('modalClose');
  var modalCancel = document.getElementById('modalCancel');
  var modalConfirm = document.getElementById('modalConfirm');
  var modalName = document.getElementById('modalName');
  var modalRole = document.getElementById('modalRole');

  function openModal() {
    if (addModal) {
      addModal.classList.add('show');
      if (modalName) modalName.value = '';
      if (modalRole) modalRole.value = '';
      setTimeout(function() { if (modalName) modalName.focus(); }, 100);
    }
  }

  function closeModal() {
    if (addModal) addModal.classList.remove('show');
  }

  if (addBtn) addBtn.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalCancel) modalCancel.addEventListener('click', closeModal);
  if (addModal) {
    addModal.addEventListener('click', function(e) {
      if (e.target === addModal) closeModal();
    });
  }

  if (modalConfirm) {
    modalConfirm.addEventListener('click', function() {
      var name = modalName.value.trim();
      var role = modalRole.value.trim();
      if (!name) return;
      var participantsList = document.getElementById('participantsList');
      if (!participantsList) return;
      var html = '<div class="mt-participant"><div class="mt-avatar">' + name.charAt(0) + '</div><div class="mt-participant-info"><div class="mt-participant-name">' + name + '</div><div class="mt-participant-role">' + (role || '参会人员') + '</div></div><button class="mt-participant-remove" title="移除"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg></button></div>';
      participantsList.insertAdjacentHTML('beforeend', html);
      setupRemoveButtons();
      closeModal();
      updateParticipantCount();
    });
  }

  // ---- Auto-expand sidebar on load ----
  if (sidebarWrapper) {
    sidebarWrapper.classList.add('expanded');
  }

  // ---- Click outside to close sidebar ----
  document.addEventListener('click', function(e) {
    if (sidebarWrapper && sidebarWrapper.classList.contains('expanded')) {
      if (!sidebarWrapper.contains(e.target) && !e.target.closest('.s-item')) {
        sidebarWrapper.classList.remove('expanded');
      }
    }
  });

  // ---- Expose public API ----
  window.MeetingCommon = {
    openSidebar: openSidebar,
    closeSidebar: closeSidebar,
    updateNotesCount: updateNotesCount,
    setupRemoveButtons: setupRemoveButtons,
    updateParticipantCount: updateParticipantCount,
    openModal: openModal,
    closeModal: closeModal
  };

})();
