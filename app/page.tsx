import Header from "@/components/Header";
import ProjectsWithChat from "@/components/ProjectsWithChat";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <div className="mt-6 flex flex-1 flex-col">
        <ProjectsWithChat />
      </div>
    </div>
  );
}
