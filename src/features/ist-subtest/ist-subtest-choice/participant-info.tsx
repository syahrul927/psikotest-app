import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ParticipantInfoProps {
  name?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  education?: string;
}

export function ParticipantInfo({
  name = "John Doe",
  phone = "+1 (555) 123-4567",
  address = "123 Main Street, New York, NY 10001",
  dateOfBirth = "January 15, 1990",
  placeOfBirth = "New York, USA",
  education = "Bachelor of Science in Computer Science",
}: ParticipantInfoProps) {
  return (
    <Card className="relative w-full overflow-hidden">
      {/* Add the geometric pattern overlay */}
      <div
        className="absolute top-0 right-0 bottom-0 h-full w-1/3 -mask-linear-100 mask-linear-from-0% mask-linear-to-80% opacity-10"
        style={
          {
            "--s": "25px",
            "--c1": "#000000",
            "--c2": "#ffffff",
            "--c": "#0000 71%, var(--c1) 0 79%, #0000 0",
            "--_s":
              "calc(var(--s) / 2) / calc(2 * var(--s)) calc(2 * var(--s))",
            background: `
        linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0)),
        linear-gradient(45deg, var(--c)) calc(var(--s) / -2) var(--_s),
        linear-gradient(135deg, var(--c)) calc(var(--s) / 2) var(--_s),
        radial-gradient(var(--c1) 35%, var(--c2) 37%) 0 0 / var(--s) var(--s)
      `,
          } as React.CSSProperties
        }
      />

      <CardHeader className="relative z-10">
        <CardTitle className="text-2xl">{name}</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm font-medium">
            Phone
          </Label>
          <p className="text-sm">{phone}</p>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm font-medium">
            Date of Birth
          </Label>
          <p className="text-sm">{dateOfBirth}</p>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm font-medium">
            Address
          </Label>
          <p className="text-sm">{address}</p>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm font-medium">
            Place of Birth
          </Label>
          <p className="text-sm">{placeOfBirth}</p>
        </div>
        <div className="col-span-2 space-y-2">
          <Label className="text-muted-foreground text-sm font-medium">
            Education
          </Label>
          <p className="text-sm">{education}</p>
        </div>
      </CardContent>
    </Card>
  );
}
