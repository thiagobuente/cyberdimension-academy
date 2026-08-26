import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ReadingPreferencesProvider } from "./contexts/ReadingPreferencesContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Quiz from "./pages/Quiz";
import Certificate from "./pages/Certificate";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import Tutor from "./pages/Tutor";
import Progress from "./pages/Progress";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetails from "./pages/CourseDetails";
import FormationStudy from "./pages/FormationStudy";
import FormationCertificate from "./pages/FormationCertificate";
import CertificateVerify from "./pages/CertificateVerify";
import Profile from "./pages/Profile";
import BadgeVerify from "./pages/BadgeVerify";
import PublicPortfolio from "./pages/PublicPortfolio";
import CareerQuiz from "./pages/CareerQuiz";
import AdminLogin from "./pages/AdminLogin";
import AcademyPaths from "./pages/AcademyPaths";
import GrcAppliedLesson from "./pages/GrcAppliedLesson";
import TechnicalEnglishCourse from "./pages/TechnicalEnglishCourse";
import SecurityPlusPath from "./pages/SecurityPlusPath";
import CloudSecurityPath from "./pages/CloudSecurityPath";
import SocVideoPath from "./pages/SocVideoPath";
import VideoLibrary from "./pages/VideoLibrary";
import FreeVideoCourses from "./pages/FreeVideoCourses";
import SpecialtySimulations from "./pages/SpecialtySimulations";
import Portfolio from "./pages/Portfolio";
import ContentPolicy from "./pages/ContentPolicy";
import Podcast from "./pages/Podcast";
import CyberProjects from "./pages/CyberProjects";
import Ctfs from "./pages/Ctfs";
import CheatSheets from "./pages/CheatSheets";
import FgvProjectManagement from "./pages/FgvProjectManagement";
import Notifications from "./pages/Notifications";
import Favorites from "./pages/Favorites";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/notificacoes"} component={Notifications} />
      <Route path={"/favorites"} component={Favorites} />
      <Route path={"/videos"} component={VideoLibrary} />
      <Route path={"/cursos-gratuitos"} component={FreeVideoCourses} />
      <Route path={"/podcast"} component={Podcast} />
      <Route path={"/audiolab"}><Redirect to={"/podcast"} /></Route>
      <Route path={"/cyber-projects"} component={CyberProjects} />
      <Route path={"/catalog"} component={CourseCatalog} />
      <Route path={"/trilha/gestao-projetos-fgv"} component={FgvProjectManagement} />
      <Route path={"/politica-de-conteudo"} component={ContentPolicy} />
      <Route path={"/catalog/:slug"} component={CourseDetails} />
      <Route path={"/academias/:slug"} component={AcademyPaths} />
      <Route path={"/securityplus/trilha"} component={SecurityPlusPath} />
      <Route path={"/cloud-security/trilha"} component={CloudSecurityPath} />
      <Route path={"/soc/trilha"} component={SocVideoPath} />
      <Route path={"/simulados"} component={SpecialtySimulations} />
      <Route path={"/portfolio"} component={Portfolio} />
      <Route path={"/aulas/grc-aplicado"} component={GrcAppliedLesson} />
      <Route path={"/aulas/ingles-tecnico"} component={TechnicalEnglishCourse} />
      <Route path={"/formacoes/:slug/estudar"} component={FormationStudy} />
      <Route path={"/formacao/:slug/estudar"} component={FormationStudy} />
      <Route path={"/formation/:slug"} component={FormationStudy} />
      <Route path={"/course/:domainId"} component={Course} />
      <Route path={"/quiz"} component={Quiz} />
      <Route path={"/quiz/:domainId"} component={Quiz} />
      <Route path={"/certificate/course/:id"} component={FormationCertificate} />
      <Route path={"/certificate/:id"} component={Certificate} />
      <Route path={"/verify-certificate"} component={CertificateVerify} />
      <Route path={"/badge/:id"} component={BadgeVerify} />
      <Route path={"/portfolio-publico/:token"} component={PublicPortfolio} />
      <Route path={"/carreira"} component={CareerQuiz} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/tutor"} component={Tutor} />
      <Route path={"/ctfs"} component={Ctfs} />
      <Route path={"/materiais"} component={CheatSheets} />
      <Route path={"/progress"} component={Progress} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/acesso"} component={AdminLogin} />
      <Route path={"/admin/users"} component={AdminUsers} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <ReadingPreferencesProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ReadingPreferencesProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
