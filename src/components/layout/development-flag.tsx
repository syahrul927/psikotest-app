import { ChevronLeft, Construction } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const DevelopmentFlag = () => {
  return (
    <div className="bg-backgroun/10 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <Card className="mx-4 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <Construction className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Under Development</CardTitle>
          <CardDescription>
            We're working hard to bring you something amazing. Our site is
            currently under construction.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-2">
          <p className="text-muted-foreground text-center text-sm">
            Thank you for your patience
          </p>
          <Button variant={"outline"}>
            <ChevronLeft />
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
