import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Agents from "./pages/Agents";
import OnChainMarketing from "./pages/OnChainMarketing";
import OffChainMarketing from "./pages/OffChainMarketing";
import AdobeCreative from "./pages/AdobeCreative";
import Analytics from "./pages/Analytics";
import Campaigns from "./pages/Campaigns";
import ViralPrediction from "./pages/ViralPrediction";
import CreativeStudio from "./pages/CreativeStudio";
import GrowthAnalytics from "./pages/GrowthAnalytics";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/agents" component={Agents} />
      <Route path="/on-chain" component={OnChainMarketing} />
      <Route path="/off-chain" component={OffChainMarketing} />
      <Route path="/adobe-creative" component={AdobeCreative} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/viral-prediction" component={ViralPrediction} />
      <Route path="/creative-studio" component={CreativeStudio} />
      <Route path="/growth-analytics" component={GrowthAnalytics} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
