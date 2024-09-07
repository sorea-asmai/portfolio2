import { json } from '@remix-run/cloudflare';
import { Outlet, useLoaderData } from '@remix-run/react';
import { MDXProvider } from '@mdx-js/react';
import { Post, postMarkdown } from '~/layouts/post';
import { baseMeta } from '~/utils/meta';
import config from '~/config.json';
import { formatTimecode, readingTime } from '~/utils/timecode';

export async function loader({ request }) {
  const slug = request.url.split('/').at(-1);

  try {
    const module = await import(`../articles.${slug}.mdx`);
    const { default: text, frontmatter } = module;
    const readTime = readingTime(text);
    const ogImage = `${config.url}/static/${slug}-og.jpg`;

    try {
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
      // Generate OG image using Puppeteer (not shown in the code)
    } catch (error) {
      console.error(`Error launching Puppeteer browser: ${error}`);
      return json({ error: 'Failed to generate OG image' }, 500);
    }

    return json({
      ogImage,
      frontmatter,
      timecode: formatTimecode(readTime),
    });
  } catch (error) {
    console.error(`Error importing MDX file: ${error}`);
    return json({ error: 'Failed to load article' }, 500);
  }
}

export function meta({ data }) {
  const { title, abstract } = data.frontmatter;
  return baseMeta({ title, description: abstract, prefix: '', ogImage: data.ogImage });
}

export default function Articles() {
  const { frontmatter, timecode } = useLoaderData();

  return (
    <MDXProvider components={postMarkdown}>
      <Post {...frontmatter} timecode={timecode}>
        <Outlet />
      </Post>
    </MDXProvider>
  );
}
