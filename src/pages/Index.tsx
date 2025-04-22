
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ThreeCube from "../three/ThreeCube";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background py-12">
      <div className="w-full max-w-xl px-4 flex flex-col items-center">
        <Card className="w-full mb-8 bg-card/90 shadow-xl border-none">
          <CardContent className="flex flex-col items-center py-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary-foreground">
              Moment
            </h1>
            <p className="text-lg md:text-xl text-card-foreground mb-6 text-center">
              Stay hyper-aware of your time.<br />
              <span className="text-primary">Organize</span>, <span className="text-primary">see the countdown</span>, and <span className="text-primary">reflect</span> — all in one elegant flow.
            </p>
            {/* 3D animation placeholder */}
            <div className="mt-4 w-full h-60 rounded-2xl overflow-hidden bg-accent/80 flex items-center justify-center border border-accent shadow-glass backdrop-blur-md">
              <Suspense fallback={<div className="text-muted-foreground">Loading 3D...</div>}>
                <ThreeCube />
              </Suspense>
            </div>
          </CardContent>
        </Card>
        {/* Minimal hint at navigation or features, just to organize the page */}
        <div className="text-muted-foreground text-center text-sm mb-4">
          Designed for elegance, simplicity, and mindful organization.
        </div>
        {/* New navigation link */}
        <a
          href="/profile"
          className="mt-2 text-primary font-medium underline underline-offset-2 hover:text-primary/80 transition-colors"
        >
          View Profile Section &rarr;
        </a>
      </div>
    </div>
  );
};

export default Index;
