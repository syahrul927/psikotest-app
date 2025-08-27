# PAPI-Kostick Results Page Implementation Plan

## Component Recommendations

### 1. Radar Chart
**Primary Choice**: Use Recharts' `RadarChart` with shadcn's `Chart` component styling
- **Package**: `recharts` (needs installation)
- **Component Structure**:
  ```tsx
  import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
  import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
  ```
- **Styling**: The `ChartContainer` provides perfect shadcn theme integration

### 2. Data Table
**Primary Choice**: shadcn's `Table` component with custom mapping
- **Component**: `/components/ui/table`
- **Features**: Clean minimalist design, responsive, themable
- **Columns**: Category | Aspect | Scale | Score
- **Pattern**: Use the DataTable pattern from dashboard-01 block for enhanced functionality

### 3. Supporting Components for Enhanced UI

#### Layout Components
- **Card** (`/components/ui/card`): Wrap sections with clean borders and shadows
- ** Separator** (`/components/ui/separator`): Visual separation between radar chart and table
- **Tabs** (`/components/ui/tabs`): Optional for categorizing different aspect views

#### Visualization Enhancement
- **Badge** (`/components/ui/badge`): Score ranges and status indicators
- **Tooltip** (`/components/ui/tooltip`): Factor descriptions on hover

## Implementation Structure

### Required Installations
```bash
npm install recharts
```

### Component Architecture
```
PapiKostickResultsPage
├── ResultsHeader
├── RadarChartSection (Card)
│   └── RadarChart
├── ResultsTableSection (Card)  
│   └── Table (Categorized results)
└── SummarySection (Optional)
```

### Data Flow
```typescript
// Raw data
interface PapiKostickResultDetail {
  factor: string
  rawScore: number
  normalizedScore: number
}

// Mapped for radar chart
interface RadarDataPoint {
  factor: string
  score: number  // normalizedScore
}

// Mapped for table
interface CategorizedResult {
  category: string    // from papi-kostick-utils.ts
  aspect: string      // factor name
  scale: string       // descriptive scale
  score: number       // normalizedScore
}
```

### Shadcn Components to Use
1. `Chart` + `ChartContainer` - Radar chart wrapper
2. `Table` - Results table
3. `Card` - Section containers
4. `Badge` - Score indicators
5. `Separator` - Visual dividers

### Styling Approach
- **Minimalist Design**: Clean borders, subtle shadows
- **Theme Consistency**: Full shadcn theme integration
- **Responsive**: Mobile-first using shadcn's responsive utilities
- **Color Scheme**: Consistent with shadcn primary/secondary colors

### File Structure Recommendation
```
src/app/guest/papi-kostick/[slug]/results/
├── page.tsx                    # Main page with layout
├── components/
│   ├── papi-radar-chart.tsx    # Radar chart wrapper
│   ├── results-table.tsx       # Categorized table
│   └── score-indicators.tsx    # Badge components
└── utils/
    └── chart-config.ts         # Chart configuration
```

This approach leverages the established shadcn/ui patterns while providing a clean, professional interface for psychology test results.