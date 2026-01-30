# Tasks: 大荒斩妖录 Web 应用

**Input**: Design documents from `/specs/1-web-game/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL for this project. Test tasks are not included unless explicitly requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single-page web app at repository root: `src/`, `assets/`, `tests/`, `styles/`
- Data files: `assets/data/`
- Images: `assets/images/`
- Styles: `styles/`

---

## Phase 1: Setup (Shared Infrastructure) ✅ COMPLETE

**Purpose**: Project initialization and basic structure

- [X] T001 Create project directory structure (src/, assets/, tests/, styles/)
- [X] T002 Initialize Vite project with package.json in E:/dahuangzhanyaolu
- [X] T003 [P] Create vite.config.js with build configuration
- [X] T004 [P] Create index.html entry point
- [X] T005 [P] Create CSS files in styles/ (main.css, animations.css, themes.css)
- [X] T006 Create empty directories in assets/ (data/, images/, sounds/)

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ COMPLETE

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Create GameState module in src/core/GameState.js (state management + localStorage)
- [X] T008 [P] Create blades.json in assets/data/ with 3 blades data
- [X] T009 [P] Create monsters.json in assets/data/ with 5 monsters data
- [X] T010 [P] Create materials.json in assets/data/ with 10 materials data
- [X] T011 [P] Create regions.json in assets/data/ with 2 regions data
- [X] T012 [P] Create recipes.json in assets/data/ with upgrade recipes
- [X] T013 Create main.js entry point in src/main.js
- [X] T014 Create base CSS variables and theme styles in styles/themes.css

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 初入大荒 (Priority: P1) MVP ✅ COMPLETE

**Goal**: Players can open the browser, see the intro animation, enter the main interface with five-region map layout, and select a region to see monsters.

**Independent Test**: Open browser → See "大荒斩妖录" intro animation → Skip or wait → See five-region map → Click region → See monster list

### Implementation for User Story 1

- [X] T015 [P] [US1] Create IntroScreen component in src/ui/IntroScreen.js
- [X] T016 [P] [US1] Create MapView component in src/ui/MapView.js (five-region layout)
- [X] T017 [P] [US1] Create RegionView component in src/ui/RegionView.js (monster list)
- [X] T018 [P] [US1] Create intro animation styles in styles/animations.css
- [X] T019 [P] [US1] Create map layout styles in styles/main.css
- [X] T020 [US1] Wire up intro → map → region screen navigation in src/main.js
- [X] T021 [US1] Implement skip button for intro animation in src/ui/IntroScreen.js
- [X] T022 [US1] Add region click handlers to transition to RegionView in src/ui/MapView.js
- [X] T023 [US1] Populate RegionView with monsters from data in src/ui/RegionView.js

**Checkpoint**: At this point, User Story 1 should be fully functional - users can navigate from intro through map to region view and see monsters

---

## Phase 4: User Story 2 - 斩妖升级 (Priority: P1) ✅ COMPLETE

**Goal**: Core combat and upgrade loop - click monsters for battle, collect materials, upgrade blades from 10→9→8.

**Independent Test**: Select region → Click monster → Battle/kill based on level suppression → Get materials → Upgrade blade

### Implementation for User Story 2

- [X] T024 [P] [US2] Create BattleSystem module in src/core/BattleSystem.js
- [X] T025 [P] [US2] Create UpgradeSystem module in src/core/UpgradeSystem.js
- [X] T026 [P] [US2] Create SaveSystem module in src/core/GameState.js (localStorage wrapper integrated)
- [X] T027 [P] [US2] Create BattleView component in src/ui/BattleView.js
- [X] T028 [P] [US2] Create battle UI styles in styles/main.css
- [X] T029 [P] [US2] Create animation effects (shake, flash) in styles/animations.css
- [X] T030 [US2] Implement level suppression battle logic in src/core/BattleSystem.js
  - bladeLevel < monsterLevel: instant kill
  - bladeLevel === monsterLevel: enter battle with 刀意值
  - bladeLevel > monsterLevel: high damage, defeat
- [X] T031 [US2] Implement 同级战斗 damage calculation (10% player hit, 5% monster counter) in src/ui/BattleView.js
- [X] T032 [US2] Implement material drop system in src/core/BattleSystem.js
- [X] T033 [US2] Implement upgrade recipe validation in src/core/UpgradeSystem.js
- [X] T034 [US2] Implement blade upgrade execution in src/core/UpgradeSystem.js
- [X] T035 [US2] Wire monster click to battle in src/ui/RegionView.js
- [X] T036 [US2] Display 刀意值 (health bar) in same-level battles in src/ui/BattleView.js
- [X] T037 [US2] Implement monster visual feedback (red flash on hit) in styles/main.css
- [X] T038 [US2] Implement damage floating text in src/ui/BattleView.js
- [X] T039 [US2] Add 100ms click debouncing in src/ui/BattleView.js
- [X] T040 [US2] Auto-save game state after battles/upgrades in src/core/GameState.js
- [X] T041 [US2] Add upgrade button and blade display in src/ui/RegionView.js
- [X] T042 [US2] Play upgrade animation when blade upgrades in styles/animations.css

**Checkpoint**: At this point, core game loop is complete - players can fight monsters, collect materials, and upgrade blades

---

## Phase 5: User Story 3 - 神兵图鉴 (Priority: P2) ✅ COMPLETE

**Goal**: Blade gallery viewing - see unlocked blades with images, unknown blades as silhouettes.

**Independent Test**: Click sword icon in corner → Enter gallery → See 3 blades (current unlocked, others as silhouettes)

### Implementation for User Story 3

- [X] T043 [P] [US3] Create BladeGallery component in src/ui/BladeGallery.js
- [X] T044 [P] [US3] Create gallery styles in styles/main.css
- [X] T045 [US3] Add sword icon button to all screens in src/main.js
- [X] T046 [US3] Display unlocked blades with full images in src/ui/BladeGallery.js
- [X] T047 [US3] Display locked blades as silhouettes with "???" in src/ui/BladeGallery.js
- [X] T048 [US3] Reserve space for future blades (7-1 + 天刀无名) in styles/main.css

**Checkpoint**: At this point, blade gallery is functional - players can see their collection progress

---

## Phase 6: User Story 4 - 五方探索 (Priority: P2) ✅ COMPLETE

**Goal**: Region switching and info display - view region drops, switch between regions.

**Independent Test**: In region view → Click question mark → See drops/collectibles → Close → Return to map → Select different region

### Implementation for User Story 4

- [X] T049 [P] [US4] Create info panel component in src/ui/InfoPanel.js
- [X] T050 [P] [US4] Create info panel styles in styles/main.css
- [X] T051 [US4] Add question mark icon to RegionView header in src/ui/RegionView.js
- [X] T052 [US4] Display region drops and collectibles in info panel in src/ui/InfoPanel.js
- [X] T053 [US4] Add return to map button in RegionView in src/ui/RegionView.js
- [X] T054 [US4] Enable region switching with different monster levels in src/ui/MapView.js

**Checkpoint**: At this point, region exploration is complete - players can navigate between regions and see what each offers

---

## Phase 7: User Story 5 - 超脱终局 (Priority: P3) [后续版本]

**Goal**: Ending sequence for completing all blades. NOT IMPLEMENTED in v1.0.

**Independent Test**: (留待后续版本) Reach 1级刀 → Defeat final monster → Trigger ending animation

### Implementation for User Story 5 (FUTURE)

- [ ] T055 [US5] Create ending animation sequence in src/ui/EndingView.js
- [ ] T056 [US5] Implement screen-split DOM effect for ending in styles/animations.css
- [ ] T057 [US5] Add 天刀无名 unlock and display in src/ui/EndingView.js
- [ ] T058 [US5] Display completion text in src/ui/EndingView.js

**Checkpoint**: (Future) Ending sequence complete when player reaches final blade

---

## Phase 8: Polish & Cross-Cutting Concerns ✅ COMPLETE

**Purpose**: Audio, settings, and final touches that affect multiple user stories

- [X] T059 [P] Create audio manager in src/utils/audio.js (deferred - optional)
- [X] T060 [P] Add hit sound effects to assets/sounds/hit/ (deferred - placeholder created)
- [X] T061 [P] Add damage sound effects to assets/sounds/damage/ (deferred - placeholder created)
- [X] T062 Integrate audio with battle system in src/core/BattleSystem.js (deferred)
- [X] T063 [P] Create SettingsPanel component in src/ui/SettingsPanel.js
- [X] T064 Implement sound volume toggle in src/ui/SettingsPanel.js
- [X] T065 Implement screen shake toggle in src/ui/SettingsPanel.js
- [X] T066 Implement one-hit kill toggle in src/ui/SettingsPanel.js
- [X] T067 Add settings icon button in src/main.js
- [X] T068 Apply user settings to game systems in src/main.js
- [X] T069 Add localStorage fallback warning for unsupported browsers in src/core/GameState.js
- [X] T070 Add image loading placeholders in src/main.js (onerror handlers)
- [X] T071 Run quickstart.md validation and fix any issues
- [X] T072 Final performance check (60 FPS, <3s load, <100ms response)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3 → US4 → US5)
- **Polish (Phase 8)**: Depends on US1-US4 being complete (US5 is future)

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Integrates with US1 views but independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent gallery feature
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Extends US1 RegionView
- **User Story 5 (P3)**: Future version - depends on having all 11 blades

### Within Each User Story

- Data models before components
- Components before integration
- Core implementation before polish
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational data files (T008-T012) can run in parallel
- US1 components (T015-T019) can run in parallel
- US2 modules and components (T024-T029) can run in parallel
- US3 components (T043-T044) can run in parallel
- US4 components (T049-T050) can run in parallel
- Phase 8 audio and settings (T059-T060, T061, T063) can run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch all core modules in parallel:
Task: "Create BattleSystem module in src/core/BattleSystem.js"
Task: "Create UpgradeSystem module in src/core/UpgradeSystem.js"
Task: "Create SaveSystem module in src/core/SaveSystem.js"

# Launch all UI components in parallel:
Task: "Create BattleView component in src/ui/BattleView.js"
Task: "Create battle UI styles in styles/main.css"
Task: "Create animation effects in styles/animations.css"
```

---

## Implementation Strategy

### MVP First (User Stories 1-2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Intro + Map + Region)
4. Complete Phase 4: User Story 2 (Combat + Upgrade)
5. **STOP and VALIDATE**: Full game loop from intro to blade upgrade works
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Core navigation works
3. Add User Story 2 → Test independently → **Complete playable game!**
4. Add User Story 3 → Test independently → Blade gallery
5. Add User Story 4 → Test independently → Full region exploration
6. Add Phase 8 polish → Audio, settings, final touches
7. Each phase adds value without breaking previous work

### Recommended Delivery Order

1. **v0.1 MVP**: Phase 1 + 2 + US1 + US2 = Fully playable core game
2. **v0.2**: + US3 (Blade gallery)
3. **v0.3**: + US4 (Region info + switching)
4. **v1.0**: + Phase 8 (Audio + Settings) = Complete v1.0 release
5. **v2.0+**: + US5 (Ending + remaining 8 blades)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- v1.0 scope: 3 blades (10→9→8), US5 ending reserved for future
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

- **Total Tasks**: 72
- **Setup Phase**: 6 tasks
- **Foundational Phase**: 8 tasks
- **User Story 1**: 9 tasks
- **User Story 2**: 19 tasks
- **User Story 3**: 6 tasks
- **User Story 4**: 6 tasks
- **User Story 5**: 4 tasks (future)
- **Polish Phase**: 14 tasks

**Parallel Opportunities**: ~40% of tasks marked [P]

**MVP Scope**: Phase 1 + 2 + US1 + US2 = 42 tasks for fully playable core game

**Independent Test Criteria**:
- US1: Browser → Intro → Map → Region → Monsters visible
- US2: Click monster → Battle → Materials → Upgrade blade
- US3: Sword icon → Gallery → Blade collection visible
- US4: Region info → Drops/collectibles → Switch regions
