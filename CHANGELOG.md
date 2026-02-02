# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-02-03

### Added
- **Frontend**: "Overdue" badge (Red) for Deposited rooms with past start dates.
- **Frontend**: "Deposited" status filter in Dashboard.
- **Frontend**: "Occupied" badge (Blue) to Room Card header.
- **Frontend**: Missing translation for `contracts.overdue`.
- **Backend**: `POST /rooms/fix-order` endpoint to initialize room ordering.

### Changed
- **Frontend**: **Ultra-Compact Room Card UI**: Reduced padding, fonts, and spacing.
- **Frontend**: Moved Available/Maintenance status from button to Header Badge.
- **Frontend**: Reordered Dashboard status badges (Occupied -> Deposited -> Available).
- **Frontend**: Implemented **Dynamic Pagination** (Max 2 rows per group) responsive to screen width.
- **Frontend**: Enabled **Drag and Drop** for Room Cards.

### Fixed
- **Frontend**: Removed pagination from `RoomGroupCollapse` to allow seamless drag-and-drop.
