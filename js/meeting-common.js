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

  // ---- Participants / Notes / Settings Tab Switching ----
  var tabParticipants = document.getElementById('tabParticipants');
  var tabNotes = document.getElementById('tabNotes');
  var participantsList = document.getElementById('participantsList');
  var notesList = document.getElementById('notesList');
  var searchWrap = document.getElementById('searchWrap');

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

  // ---- Select Participant (multi-select checkbox) ----
  var participantsConfirmed = false;

  function updateSelectBtn() {
    var btn = document.getElementById('addParticipantsBtn');
    if (btn) btn.style.display = 'none';
  }

  function getChipName(chip) {
    if (!chip) return '';
    var nameEl = chip.querySelector('span:last-child');
    return nameEl ? nameEl.textContent.trim() : '';
  }

  function addChip(name) {
    var infoBox = document.querySelector('.mt-participants-info-box');
    if (!infoBox) return;
    // Don't add duplicate
    var existing = Array.prototype.slice.call(infoBox.querySelectorAll('.mt-participant-chip'));
    if (existing.some(function(c) { return getChipName(c) === name; })) return;
    var avatar = name.charAt(0);
    var chip = document.createElement('button');
    chip.className = 'mt-participant-chip';
    chip.type = 'button';
    chip.innerHTML = '<span class="chip-avatar">' + avatar + '</span><span class="chip-close">&times;</span><span>' + name + '</span>';
    infoBox.appendChild(chip);
  }

  function removeChip(name) {
    var infoBox = document.querySelector('.mt-participants-info-box');
    if (!infoBox) return;
    var chips = infoBox.querySelectorAll('.mt-participant-chip');
    Array.prototype.forEach.call(chips, function(c) {
      if (getChipName(c) === name) {
        c.style.transition = 'all 0.2s ease';
        c.style.opacity = '0';
        c.style.transform = 'scale(0.8)';
        setTimeout(function() { if (c.parentNode) c.remove(); }, 200);
      }
    });
  }

  function syncChipsFromSelection() {
    var infoBox = document.querySelector('.mt-participants-info-box');
    if (!infoBox) return;
    // Remove all chips
    infoBox.innerHTML = '';
    // Add chips for all selected participants
    document.querySelectorAll('.mt-participant.selected').forEach(function(p) {
      var nameEl = p.querySelector('.mt-participant-name');
      if (nameEl) addChip(nameEl.textContent.trim());
    });
  }

  function setupSelectButtons() {
    document.querySelectorAll('.mt-participant-select').forEach(function(btn) {
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var card = this.closest('.mt-participant');
        card.classList.toggle('selected');
        var nameEl = card.querySelector('.mt-participant-name');
        if (nameEl) {
          var name = nameEl.textContent.trim();
          if (card.classList.contains('selected')) {
            addChip(name);
          } else {
            removeChip(name);
          }
        }
        updateSelectBtn();
      });
    });
  }
  setupSelectButtons();
  updateSelectBtn();

  // ---- Add Participants button: keep only selected, rename title ----
  function convertToRemoveMode() {
    document.querySelectorAll('.mt-participant .mt-participant-select').forEach(function(btn) {
      var removeBtn = document.createElement('button');
      removeBtn.className = 'mt-participant-remove';
      removeBtn.title = '移除';
      removeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
      btn.replaceWith(removeBtn);
      removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var card = this.closest('.mt-participant');
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateX(20px)';
        setTimeout(function() {
          card.remove();
          updateParticipantCount();
        }, 300);
      });
    });
  }

  var addParticipantsBtn = document.getElementById('addParticipantsBtn');
  if (addParticipantsBtn) {
    addParticipantsBtn.addEventListener('click', function() {
      if (participantsConfirmed) { openMembersModal(); return; }
      document.querySelectorAll('.mt-participant').forEach(function(p) {
        if (!p.classList.contains('selected')) p.remove();
      });
      document.querySelectorAll('.mt-participant.selected').forEach(function(p) {
        p.classList.remove('selected');
      });
      var title = document.querySelector('.mt-participants-title');
      if (title) title.textContent = '参会人员';
      participantsConfirmed = true;
      updateSelectBtn();
      updateParticipantCount();
      convertToRemoveMode();
    });
  }

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
      var html = '<div class="mt-participant"><div class="mt-avatar">' + name.charAt(0) + '</div><div class="mt-participant-info"><div class="mt-participant-name">' + name + '</div><div class="mt-participant-role">' + (role || '参会人员') + '</div></div><button class="mt-participant-select" title="选择"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="16" height="16" rx="4"></rect><path class="mt-check-mark" d="M6 10.5l2.6 2.6L14.6 7"></path></svg></button></div>';
      participantsList.insertAdjacentHTML('beforeend', html);
      if (participantsConfirmed) { convertToRemoveMode(); } else { setupSelectButtons(); }
      closeModal();
      updateParticipantCount();
    });
  }

  // ---- Members Select Modal (search / multi-select / add) ----
  var MEMBERS_POOL = [
    { name: '张三', role: '产品经理' },
    { name: '李四', role: '技术负责人' },
    { name: '王五', role: '后端开发' },
    { name: '赵六', role: '前端开发' },
    { name: '陈七', role: 'UI设计师' },
    { name: '周八', role: '测试工程师' },
    { name: '吴九', role: '运营专员' },
    { name: '郑十', role: '数据分析师' }
  ];
  var membersModal = document.getElementById('membersModal');
  var membersModalClose = document.getElementById('membersModalClose');
  var membersSearch = document.getElementById('membersSearch');
  var membersSearchClear = document.getElementById('membersSearchClear');
  var membersList = document.getElementById('membersList');
  var membersAddBtn = document.getElementById('membersAddBtn');
  var membersSelCount = document.getElementById('membersSelCount');
  var selectedMembers = [];

  function renderMembers(query) {
    if (!membersList) return;
    var q = (query || '').trim().toLowerCase();
    var html = '';
    MEMBERS_POOL.forEach(function(m) {
      if (q && m.name.toLowerCase().indexOf(q) < 0 && m.role.toLowerCase().indexOf(q) < 0) return;
      var sel = selectedMembers.indexOf(m.name) >= 0;
      html += '<div class="mt-members-item' + (sel ? ' selected' : '') + '" data-name="' + m.name + '" data-role="' + m.role + '">'
        + '<span class="mt-avatar">' + m.name.charAt(0) + '</span>'
        + '<div class="mt-member-info"><div class="mt-member-name">' + m.name + '</div><div class="mt-member-role">' + m.role + '</div></div>'
        + '<span class="mt-member-check">'
        + '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="16" height="16" rx="4"></rect><path class="mt-check-mark" d="M6 10.5l2.6 2.6L14.6 7"></path></svg>'
        + '</span></div>';
    });
    membersList.innerHTML = html || '<div class="mt-members-empty">未找到匹配人员</div>';
    updateMembersSelCount();
  }

  function updateMembersSelCount() {
    var c = selectedMembers.length;
    if (membersSelCount) membersSelCount.textContent = '已选 ' + c + ' 人';
    if (membersAddBtn) {
      membersAddBtn.style.pointerEvents = c ? 'auto' : 'none';
      membersAddBtn.style.opacity = c ? '1' : '0.4';
    }
  }

  function openMembersModal() {
    if (!membersModal) return;
    selectedMembers = [];
    if (membersSearch) membersSearch.value = '';
    renderMembers('');
    membersModal.classList.add('show');
  }

  function closeMembersModal() { if (membersModal) membersModal.classList.remove('show'); }

  if (membersModalClose) membersModalClose.addEventListener('click', closeMembersModal);
  if (membersModal) {
    membersModal.addEventListener('click', function(e) {
      if (e.target === membersModal) closeMembersModal();
    });
  }
  if (membersList) {
    membersList.addEventListener('click', function(e) {
      var item = e.target.closest('.mt-members-item');
      if (!item) return;
      var name = item.getAttribute('data-name');
      var idx = selectedMembers.indexOf(name);
      if (idx >= 0) selectedMembers.splice(idx, 1); else selectedMembers.push(name);
      renderMembers(membersSearch ? membersSearch.value : '');
    });
  }
  if (membersSearch) {
    membersSearch.addEventListener('input', function() { renderMembers(this.value); });
  }
  if (membersSearchClear) {
    membersSearchClear.addEventListener('click', function() {
      membersSearch.value = '';
      renderMembers('');
      membersSearch.focus();
    });
  }
  if (membersAddBtn) {
    membersAddBtn.addEventListener('click', function() {
      if (!selectedMembers.length) return;
      var participantsList = document.getElementById('participantsList');
      if (!participantsList) return;
      var existing = Array.prototype.slice.call(document.querySelectorAll('.mt-participant-name')).map(function(n) { return n.textContent; });
      var addedCount = 0;
      MEMBERS_POOL.forEach(function(m) {
        if (selectedMembers.indexOf(m.name) < 0) return;
        if (existing.indexOf(m.name) >= 0) return;
        var html = '<div class="mt-participant"><div class="mt-avatar">' + m.name.charAt(0) + '</div><div class="mt-participant-info"><div class="mt-participant-name">' + m.name + '</div><div class="mt-participant-role">' + m.role + '</div></div><button class="mt-participant-select" title="选择"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="16" height="16" rx="4"></rect><path class="mt-check-mark" d="M6 10.5l2.6 2.6L14.6 7"></path></svg></button></div>';
        participantsList.insertAdjacentHTML('beforeend', html);
        addedCount++;
      });
      if (addedCount && participantsConfirmed) convertToRemoveMode();
      if (addedCount) { updateParticipantCount(); setupSelectButtons(); }
      closeMembersModal();
    });
  }

  // ---- Settings Panel Tab Switching ----
  var tabSettings = document.getElementById('tabSettings');
  var tabParticipants = document.getElementById('tabParticipants');
  var tabNotes = document.getElementById('tabNotes');
  var settingsPanel = document.getElementById('settingsPanel');
  var searchWrap = document.getElementById('searchWrap');
  var participantsList = document.getElementById('participantsList');
  var participantsTitle = document.querySelector('.mt-participants-title');
  var participantsInfo = tabSettings ? document.querySelector('.mt-participants-info') : null;

  function switchTab(activeTab) {
    [tabSettings, tabParticipants, tabNotes].forEach(function(tab) {
      if (tab) tab.classList.remove('active');
    });
    if (activeTab) activeTab.classList.add('active');

    // Remember the selected tab across pages
    if (activeTab && activeTab.id) {
      try { localStorage.setItem('mtWorkbenchTab', activeTab.id); } catch (e) {}
    }

    // Settings panel only on settings tab
    if (settingsPanel) settingsPanel.classList.toggle('show', activeTab === tabSettings);

    // Notes only on notes tab
    if (notesList) notesList.classList.toggle('show', activeTab === tabNotes);

    // Participants UI (search + list + title + summary) only on participants tab
    var showParticipants = activeTab === tabParticipants;
    if (searchWrap) searchWrap.classList.toggle('hide', !showParticipants);
    if (participantsList) participantsList.classList.toggle('hide', !showParticipants);
    if (participantsTitle) participantsTitle.style.display = showParticipants ? '' : 'none';
    if (participantsInfo) participantsInfo.style.display = showParticipants ? '' : 'none';
  }

  if (tabSettings) tabSettings.addEventListener('click', function() { switchTab(tabSettings); });
  if (tabParticipants) tabParticipants.addEventListener('click', function() { switchTab(tabParticipants); });
  if (tabNotes) tabNotes.addEventListener('click', function() { switchTab(tabNotes); });

  // Restore the previously selected workbench tab on page load
  (function restoreWorkbenchTab() {
    var saved = null;
    try { saved = localStorage.getItem('mtWorkbenchTab'); } catch (e) {}
    if (saved === 'tabSettings') switchTab(tabSettings);
    else if (saved === 'tabParticipants') switchTab(tabParticipants);
    else if (saved === 'tabNotes') switchTab(tabNotes);
  })();

  // ---- Settings Dropdown Logic ----
  function setupSettingsDropdown(btnId, dropdownId) {
    var btn = document.getElementById(btnId);
    var dropdown = document.getElementById(dropdownId);
    var wrap = btn ? btn.parentElement : null;
    if (!btn || !dropdown || !wrap) return;

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (btn.disabled) return;
      var isOpen = dropdown.classList.contains('show');
      closeAllSettingsDropdowns();
      if (!isOpen) {
        dropdown.classList.add('show');
        wrap.classList.add('open');
      }
    });

    dropdown.querySelectorAll('.mt-settings-option').forEach(function(option) {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.querySelectorAll('.mt-settings-option').forEach(function(o) { o.classList.remove('selected'); });
        option.classList.add('selected');
        btn.textContent = option.textContent;
        closeAllSettingsDropdowns();
      });
    });
  }

  function closeAllSettingsDropdowns() {
    document.querySelectorAll('.mt-settings-dropdown').forEach(function(d) { d.classList.remove('show'); });
    document.querySelectorAll('.mt-settings-select-wrap').forEach(function(w) { w.classList.remove('open'); });
  }

  setupSettingsDropdown('asrModelBtn', 'asrModelDropdown');
  setupSettingsDropdown('summaryModelBtn', 'summaryModelDropdown');
  setupSettingsDropdown('audioDeviceBtn', 'audioDeviceDropdown');
  setupSettingsDropdown('microphoneDeviceBtn', 'microphoneDeviceDropdown');

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.mt-settings-select-wrap')) {
      closeAllSettingsDropdowns();
    }
  });

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

  // ---- Participant Chip Delete (click × to remove chip + deselect card) ----
  var infoBox = document.querySelector('.mt-participants-info-box');
  if (infoBox) {
    infoBox.addEventListener('click', function(e) {
      var close = e.target.closest('.chip-close');
      if (!close) return;
      var chip = close.closest('.mt-participant-chip');
      if (!chip) return;
      var name = getChipName(chip);
      // Deselect the participant card
      document.querySelectorAll('.mt-participant').forEach(function(p) {
        var nameEl = p.querySelector('.mt-participant-name');
        if (nameEl && nameEl.textContent.trim() === name) {
          p.classList.remove('selected');
        }
      });
      // Remove chip with animation
      chip.style.transition = 'all 0.2s ease';
      chip.style.opacity = '0';
      chip.style.transform = 'scale(0.8)';
      setTimeout(function() { if (chip.parentNode) chip.remove(); }, 200);
    });
  }

  // ---- Participant More Button Dropdown ----
  var participantsList = document.getElementById('participantsList');
  if (participantsList) {
    participantsList.addEventListener('click', function(e) {
      var moreBtn = e.target.closest('.mt-participant-more');
      if (moreBtn) {
        e.stopPropagation();
        var wrap = moreBtn.closest('.mt-participant-more-wrap');
        var dropdown = wrap.querySelector('.mt-participant-dropdown');
        // Close all other dropdowns
        document.querySelectorAll('.mt-participant-dropdown.show').forEach(function(d) {
          if (d !== dropdown) d.classList.remove('show');
        });
        dropdown.classList.toggle('show');
        return;
      }

      var dropdownItem = e.target.closest('.mt-dropdown-item');
      if (!dropdownItem) return;
      var wrap = dropdownItem.closest('.mt-participant-more-wrap');
      var dropdown = wrap.querySelector('.mt-participant-dropdown');
      dropdown.classList.remove('show');
      var card = wrap.closest('.mt-participant');
      var action = dropdownItem.getAttribute('data-action');
      var nameEl = card.querySelector('.mt-participant-name');
      var roleEl = card.querySelector('.mt-participant-role');
      var avatarEl = card.querySelector('.mt-avatar');

      if (action === 'edit') {
        // Open edit modal with pre-filled data
        var editModal = document.getElementById('editModal');
        var editName = document.getElementById('editModalName');
        var editRole = document.getElementById('editModalRole');
        if (editModal && editName && editRole) {
          editName.value = nameEl ? nameEl.textContent.trim() : '';
          editRole.value = roleEl ? roleEl.textContent.trim() : '';
          // Store reference to the card being edited
          editModal._card = card;
          editModal._avatarEl = avatarEl;
          editModal._nameEl = nameEl;
          editModal._roleEl = roleEl;
          editModal.classList.add('show');
        }
      } else if (action === 'delete') {
        var name = nameEl ? nameEl.textContent.trim() : '';
        // Remove chip if exists
        var chipBox = document.querySelector('.mt-participants-info-box');
        if (chipBox) {
          chipBox.querySelectorAll('.mt-participant-chip').forEach(function(c) {
            if (getChipName(c) === name) {
              c.style.transition = 'all 0.2s ease';
              c.style.opacity = '0';
              c.style.transform = 'scale(0.8)';
              setTimeout(function() { if (c.parentNode) c.remove(); }, 200);
            }
          });
        }
        // Remove card with animation
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateX(20px)';
        setTimeout(function() { if (card.parentNode) card.remove(); }, 300);
      }
    });
  }

  // Close all dropdowns on outside click
  document.addEventListener('click', function() {
    document.querySelectorAll('.mt-participant-dropdown.show').forEach(function(d) {
      d.classList.remove('show');
    });
  });

  // ---- Edit Modal Logic ----
  var editModal = document.getElementById('editModal');
  if (editModal) {
    var editModalClose = document.getElementById('editModalClose');
    var editModalCancel = document.getElementById('editModalCancel');
    var editModalConfirm = document.getElementById('editModalConfirm');
    var editModalName = document.getElementById('editModalName');
    var editModalRole = document.getElementById('editModalRole');

    function closeEditModal() {
      editModal.classList.remove('show');
      editModal._card = null;
    }

    if (editModalClose) editModalClose.addEventListener('click', closeEditModal);
    if (editModalCancel) editModalCancel.addEventListener('click', closeEditModal);
    // Close on overlay click
    editModal.addEventListener('click', function(e) {
      if (e.target === editModal) closeEditModal();
    });

    if (editModalConfirm) {
      editModalConfirm.addEventListener('click', function() {
        var card = editModal._card;
        if (!card) return;
        var newName = editModalName.value.trim();
        var newRole = editModalRole.value.trim();
        if (!newName) return;
        var oldName = editModal._nameEl ? editModal._nameEl.textContent.trim() : '';
        // Update card
        if (editModal._nameEl) editModal._nameEl.textContent = newName;
        if (editModal._roleEl) editModal._roleEl.textContent = newRole;
        if (editModal._avatarEl) editModal._avatarEl.textContent = newName.charAt(0);
        // Update chip name if card was selected
        var chipBox = document.querySelector('.mt-participants-info-box');
        if (chipBox) {
          chipBox.querySelectorAll('.mt-participant-chip').forEach(function(c) {
            if (getChipName(c) === oldName) {
              var avatarSpan = c.querySelector('.chip-avatar');
              var nameSpan = c.querySelector('span:last-child');
              if (avatarSpan) avatarSpan.textContent = newName.charAt(0);
              if (nameSpan) nameSpan.textContent = newName;
            }
          });
        }
        closeEditModal();
      });
    }
  }

  // ---- Expose public API ----
  window.MeetingCommon = {
    openSidebar: openSidebar,
    closeSidebar: closeSidebar,
    updateNotesCount: updateNotesCount,
    setupSelectButtons: setupSelectButtons,
    updateParticipantCount: updateParticipantCount,
    openModal: openModal,
    closeModal: closeModal
  };

})();
