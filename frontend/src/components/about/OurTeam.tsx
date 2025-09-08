import Section from "../Section";
import { TEAM } from "@/constants";
import { Card, CardContent } from "../ui/card";

const OurTeam = () => {
  return (
    <Section
      title="Meet Our Team"
      description="The passionate people behind Minimal, dedicated to bringing you exceptional design and service."
      bgClassName="bg-secondary-50"
      id="team"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
        {TEAM.map((member, index) => (
          <Card
            key={index}
            className="border-secondary-100 hover:shadow-lg transition-shadow duration-300 p-0"
          >
            <div className="aspect-square overflow-hidden rounded-t-lg">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6 space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  {member.name}
                </h3>
                <p className="text-secondary-200 font-medium">{member.role}</p>
              </div>
              <p className="text-secondary-200 text-sm leading-relaxed">
                {member.bio}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default OurTeam;
