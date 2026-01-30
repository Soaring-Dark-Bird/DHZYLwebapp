# 大荒斩妖录 Constitution

## Core Principles

### I. Player-First Design
All features must prioritize player experience above technical convenience. Every mechanic must be fun, fair, and understandable. Player feedback drives iteration; no feature is too sacred to remove if it doesn't serve player enjoyment.

### II. Test-First (NON-NEGOTIABLE)
TDD is mandatory: Tests written → Design approved → Tests fail → Then implement. Red-Green-Refactor cycle strictly enforced. All game mechanics must have automated tests verifying expected behavior before implementation begins.

### III. Data-Driven Architecture
Game systems must be data-driven and configuration-based. Core logic separates from data; Designers can tune balance without code changes; All game data exposed through structured formats (JSON/YAML) for iteration.

### IV. Progressive Enhancement
Start with a minimal viable core mechanic. Add complexity only when the base is solid and tested. Features ship in phases: Core → Enhanced → Polish. Never sacrifice stability for features.

### V. Observability & Debuggability
All game systems must expose internal state for debugging. Structured logging for game events; Visual debug tools where applicable; Performance metrics tracked per system; Reproducible test cases for all bugs.

## Quality Standards

### Performance
- Target 60 FPS for core gameplay on recommended hardware
- Loading screens must not exceed 3 seconds for initial game load
- Memory usage capped per platform requirements
- All frame spikes identified and addressed before release

### Reliability
- Zero data loss for player progress (cloud + local save redundancy)
- Graceful degradation for lower-spec hardware
- All edge cases (network timeout, save failure, etc.) handled with user-friendly messages

## Security

### Player Data Protection
- Save files validated against tampering
- Network communications encrypted (multiplayer features)
- No client-side trust for competitive/critical data

## Governance

This constitution supersedes all other development practices. Any deviation requires:
1. Documented rationale explaining why the principle cannot apply
2. Team lead approval
3. Migration plan for future compliance

All feature specs must pass constitution validation before implementation begins.

**Version**: 1.0.0 | **Ratified**: 2025-01-30 | **Last Amended**: 2025-01-30
