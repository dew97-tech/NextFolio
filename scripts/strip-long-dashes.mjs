import { PrismaClient } from "@prisma/client";

const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);
const apply = process.argv.includes("--apply");

function normalize(text) {
  if (!text) return text;
  return text
    .split(/(<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>)/gi)
    .map((part, index) => {
      if (index % 2 === 1) return part;
      return part
        .replaceAll(` ${EM} `, ", ")
        .replaceAll(` ${EN} `, ", ")
        .replaceAll(EM, "-")
        .replaceAll(EN, "-");
    })
    .join("");
}

const prisma = new PrismaClient();

const posts = await prisma.post.findMany({
  select: { id: true, slug: true, title: true, description: true, content: true },
});

let changed = 0;

for (const post of posts) {
  const title = normalize(post.title);
  const description = normalize(post.description);
  const content = normalize(post.content);

  const isChanged =
    title !== post.title || description !== post.description || content !== post.content;

  if (!isChanged) continue;
  changed += 1;

  if (apply) {
    await prisma.post.update({
      where: { id: post.id },
      data: { title, description, content },
    });
    console.log(`updated ${post.slug}`);
  } else {
    console.log(`would update ${post.slug}`);
  }
}

console.log(
  `${apply ? "Updated" : "Dry run"}: ${changed} of ${posts.length} posts ${
    apply ? "cleaned" : "need cleaning"
  }.`,
);

await prisma.$disconnect();
