import { cn } from '../utils/styles';

const teamMembers = [
  {
    name: 'Okidi Norbert',
    role: 'CEO & Founder',
    image: './images/Norbert.jpeg',
    bio: 'Passionate about connecting talent with opportunities.',
  },//me
  {
    name: 'Moses Nkangi',
    role: 'CTO',
    image: './images/Moses.jpeg',
    bio: 'Tech enthusiast driving innovation in recruitment.',
  },
  {
    name: 'Denise Priscila M',
    role: 'Head of HR',
    image: './images/Denise.jpeg',
    bio: 'Expert in human resources and talent acquisition.',
  },
  {
    name: 'Absolom Orianga',
    role: 'Head of HR',
    image: './images/Absolom.jpeg',
    bio: 'Expert in human resources and talent acquisition.',
  },
  {
    name: 'Puoch Mabor',
    role: 'Head of HR',
    image: './images/Puoch.jpeg',
    bio: 'Expert in human resources and talent acquisition.',
  },
  {
    name: 'Anna Akum',
    role: 'Head of HR',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    bio: 'Expert in human resources and talent acquisition.',
  }

];

const stats = [
  { label: 'Active Jobs', value: '10K+' },
  { label: 'Companies', value: '2.5K+' },
  { label: 'Job Seekers', value: '150K+' },
  { label: 'Successful Placements', value: '50K+' },
];

const About = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/5 dark:to-accent-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-8">
              <span className="block text-gray-900 dark:text-white">About</span>
              <span className="gradient-text">JobPortal</span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
              Revolutionizing the way companies and talent connect in the digital age.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={cn(
                  "glass-effect p-6 rounded-2xl text-center",
                  "hover-effect"
                )}
              >
                <dt className="text-2xl font-extrabold gradient-text mb-2">
                  {stat.value}
                </dt>
                <dd className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold gradient-text sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              We're on a mission to make job searching and hiring simpler, faster, and more human.
              By leveraging cutting-edge technology and maintaining a people-first approach, we're
              transforming how careers are built and companies grow.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-3xl font-extrabold gradient-text sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              The passionate people behind JobPortal who make it all possible.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={cn(
                  "glass-effect rounded-2xl p-6",
                  "hover-effect"
                )}
              >
                <div className="flex flex-col items-center">
                  <img
                    className="w-32 h-32 rounded-full mb-4 border-4 border-primary-500"
                    src={member.image}
                    alt={member.name}
                  />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-3xl font-extrabold gradient-text sm:text-4xl">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className={cn(
              "glass-effect p-6 rounded-2xl",
              "hover-effect"
            )}>
              <div className="text-primary-500 text-2xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Innovation
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Constantly pushing boundaries to improve the job search experience.
              </p>
            </div>
            <div className={cn(
              "glass-effect p-6 rounded-2xl",
              "hover-effect"
            )}>
              <div className="text-primary-500 text-2xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Integrity
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Building trust through transparency and honest relationships.
              </p>
            </div>
            <div className={cn(
              "glass-effect p-6 rounded-2xl",
              "hover-effect"
            )}>
              <div className="text-primary-500 text-2xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Impact
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Making a real difference in people's careers and businesses.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
